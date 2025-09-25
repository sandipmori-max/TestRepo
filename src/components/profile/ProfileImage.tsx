import React, { memo } from 'react';
import FastImage from 'react-native-fast-image';

const ProfileImage = memo(({ userId, baseLink }: any) => {
  if (!userId) return null;

  return (
    <FastImage
      source={{
        uri: `${baseLink}/FileUpload/1/UserMaster/${userId}/profileimage.jpeg?ts=${new Date().getTime()}`,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.web,
      }}
      style={{ width: 70, height: 70, borderRadius: 35 }}
    />
  );
});

export default ProfileImage;