package com.deverp.location

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.location.Location
import android.location.LocationManager
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.google.android.gms.location.*
import java.net.HttpURLConnection
import java.net.URL
import com.deverp.location.UserData

// --- Model class for token + link ---
 
class LocationService : Service() {

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationCallback: LocationCallback
    private var lastLocation: Location? = null
    private val handler = Handler()

    companion object {
        // Store list of token-link pairs
        var userDataList: MutableList<UserData> = mutableListOf()
    }

    override fun onCreate() {
        super.onCreate()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        startForeground(1, createNotification())

        startLocationUpdates()
        startRepeatingSync()

        val filter = IntentFilter(LocationManager.PROVIDERS_CHANGED_ACTION)
        registerReceiver(locationReceiver, filter)
    }

    private val locationReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            if (isLocationEnabled(context)) {
                Log.d("LocationService", "Location enabled by user, restarting updates")
                startLocationUpdates()
            } else {
                Log.w("LocationService", "Location disabled by user")
                sendDisabledToApi()
                fusedLocationClient.removeLocationUpdates(locationCallback)
                notifyLocationDisabled()
            }
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d("LocationService", "Service started/restarted")
        return START_STICKY
    }

    fun isLocationEnabled(context: Context): Boolean {
        val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) ||
            locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)
    }

    private fun createNotification(): Notification {
        val channelId = "location_service_channel"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Location Service",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }

        return NotificationCompat.Builder(this, channelId)
            .setContentTitle("ERP Location Tracking")
            .setContentText("Your location is being tracked in background")
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setOngoing(true)
            .build()
    }

    private fun startLocationUpdates() {
        if (!isLocationEnabled(this)) {
            Log.w("LocationService", "🚀 Location is disabled by user")
            notifyLocationDisabled()
            return
        }

        val request = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY,
            1000
        ).setMinUpdateDistanceMeters(0f)
            .build()

        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                super.onLocationResult(locationResult)
                if (locationResult.locations.isNotEmpty()) {
                    lastLocation = locationResult.locations.last()
                }
            }
        }

        fusedLocationClient.requestLocationUpdates(
            request,
            locationCallback,
            mainLooper
        )
    }

    private fun notifyLocationDisabled() {
        val channelId = "location_service_channel"
        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("Enable Location")
            .setContentText("Please enable location services to use this app.")
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setOngoing(false)
            .build()

        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(2, notification)
    }

    private var hasSentDisabled = false

    private fun startRepeatingSync() {
        val runnable = object : Runnable {
            override fun run() {
                if (!isLocationEnabled(this@LocationService)) {
                    fusedLocationClient.removeLocationUpdates(locationCallback)
                    if (!hasSentDisabled) {
                        sendDisabledToApi()
                        hasSentDisabled = true
                    }
                    notifyLocationDisabled()
                } else {
                    hasSentDisabled = false
                    lastLocation?.let { handleNewLocation(it) }
                }
                handler.postDelayed(this, 600_000)
            }
        }
        handler.post(runnable)
    }

    private fun sendDisabledToApi() {
        for (user in userDataList) {
            Thread {
                try {
                    val url = URL(user.link + "/msp_api.aspx/syncLocation")
                    val conn = url.openConnection() as HttpURLConnection
                    conn.requestMethod = "POST"
                    conn.doOutput = true
                    conn.setRequestProperty("Content-Type", "application/json")

                    val json = """
                        {
                        "token": "${user.token}",
                        "location": "disabled"
                        }
                    """.trimIndent()

                    conn.outputStream.use { it.write(json.toByteArray()) }
                    val response = conn.inputStream.bufferedReader().readText()
                    Log.d("LocationService", "⚠️ API Response for disabled ${user.token}: $response")
                } catch (e: Exception) {
                    Log.e("LocationService", "❌ Failed to send disabled for ${user.token}", e)
                }
            }.start()
        }
    }

    private fun handleNewLocation(location: Location) {
        Log.d("LocationService", "📍 New location: ${location.latitude}, ${location.longitude}")

        if (userDataList.isEmpty()) {
            Log.w("LocationService", "⚠️ No user data available, skipping API call")
            return
        }

        for (user in userDataList) {
            Thread {
                try {
                    val url = URL(user.link + "/msp_api.aspx/syncLocation")
                    val conn = url.openConnection() as HttpURLConnection
                    conn.requestMethod = "POST"
                    conn.doOutput = true
                    conn.setRequestProperty("Content-Type", "application/json")

                    val json = """
                        {
                        "token": "${user.token}",
                        "location": "${location.latitude},${location.longitude}"
                        }
                    """.trimIndent()

                    conn.outputStream.use { it.write(json.toByteArray()) }
                    val response = conn.inputStream.bufferedReader().readText()
                    Log.d("LocationService", "✅ API Response for ${user.token}: $response")
                } catch (e: Exception) {
                    Log.e("LocationService", "❌ Failed to sync location for ${user.token}", e)
                }
            }.start()
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        fusedLocationClient.removeLocationUpdates(locationCallback)
        handler.removeCallbacksAndMessages(null)
        unregisterReceiver(locationReceiver)
    }
}
