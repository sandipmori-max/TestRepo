import React, { memo } from 'react';
import { View } from 'react-native';
import Footer from '../../tabs/home/Footer';
 
const MemoizedFooterView = memo(({ item, index }: any) => {
  return (
    <View>
      {item?.html && (
        <Footer
          textColor="#000"
          isFromMenu={false}
          isHorizontal={false}
          footer={item?.html}
          index={index}
          accentColors="#000"
          isFromListPage={true}
        />
      )}
    </View>
  );
});

export default MemoizedFooterView;
