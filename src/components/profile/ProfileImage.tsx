import React, { memo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ERP_COLOR_CODE } from '../../utils/constants';

const ProfileImage = memo(({ userId, baseLink }: any) => {
  const [loading, setLoading] = useState(true);

  if (!userId) return null;

  return (
    <View style={{ width: 130, height: 120, marginBottom: 18 }}>
      <FastImage
        source={{
          uri: `${baseLink}/FileUpload/1/UserMaster/${userId}/profileimage.jpeg?ts=${new Date().getTime()}`,
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.web,
        }}
        style={{ width: '100%', height: '100%', borderRadius: 12 }}
        onLoadEnd={() => setLoading(false)}
      />
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color={ERP_COLOR_CODE.ERP_APP_COLOR} />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileImage;
