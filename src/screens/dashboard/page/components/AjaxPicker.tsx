import React, { useCallback, useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, Modal, ScrollView } from 'react-native';
import { useAppDispatch } from '../../../../store/hooks';
import { styles } from '../page_style';
import { ERP_COLOR_CODE } from '../../../../utils/constants';
import { getAjaxThunk } from '../../../../store/slices/ajax/thunk';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import FullViewLoader from '../../../../components/loader/FullViewLoader';

const AjaxPicker = ({ label, onValueChange, item, errors, dtext, formValues }: any) => {
  const dispatch = useAppDispatch();

  const [selectedOption, setSelectedOption] = useState(dtext || item?.text || item?.value);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (open) {
        fetchOptions();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setSelectedOption(item?.dtext || item?.text || item?.value);
  }, [dtext, item]);

  const fetchOptions = useCallback(async () => {
    try {
      setLoader(true);
      const res = await dispatch(
        getAjaxThunk({
          dtlid: item?.dtlid,
          where: item?.ddlwhere,
          search: search,
        }),
      ).unwrap();
      setOptions(res?.data ?? []);
      setLoader(false);
    } catch (e) {
      setOptions([]);
      setLoader(false);
    }
  }, [dispatch, item?.dtlid, item?.ddlwhere, search]);

  const handleOpen = async () => {
    setOpen(true);
    await fetchOptions();
  };

  const handleSelect = (opt: any) => {
    const afterDash = item?.ddl?.split('-')[1];
    const arr = afterDash?.split(',');

    const result = arr?.reduce((acc, key) => {
      const lowerKey = key?.toLowerCase();
      acc[lowerKey] = String(opt[lowerKey] ?? '');
      return acc;
    }, {});

    onValueChange({
      [item?.dfield]:
        opt[`${item?.ddlfield.toLowerCase()}id`] ?? opt[`${item?.field}id`] ?? opt[item?.field],

      [item?.dfield || item?.ddlfield.toLowerCase()]:
        opt[item?.ddlfield.toLowerCase()] ?? opt[item?.dfield],

      ...result,
    });

    setSelectedOption(opt[item?.ddlfield.toLowerCase()] ?? opt[item?.dfield]);
    setOpen(false);
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.label}>{label}</Text>
        {item?.tooltip !== label && <Text> - ( {item?.tooltip} ) </Text>}
        {item?.mandatory === '1' && <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR }}>*</Text>}
      </View>

      <TouchableOpacity
        style={[
          styles.pickerBox,
          item?.disabled === '1' && styles.disabledBox,
          errors[item?.field] && {
            borderColor: ERP_COLOR_CODE.ERP_ERROR,
          },
        ]}
        onPress={() => {
          if (item?.disabled !== '1') {
            handleOpen();
          }
        }}
        activeOpacity={0.7}
      >
        <Text style={{ color: selectedOption ? '#000' : '#888', flex: 1 }}>
          {selectedOption || `Select ${label}`}
        </Text>
        <MaterialIcons name={'arrow-drop-down'} size={24} color="#555" />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
        >
          <View
            style={{
              height: '75%',
              backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: 16,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>{label}</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={{ position: 'relative', marginVertical: 12 }}>
              <TextInput
                style={[styles.textInput, { paddingRight: 40 }]}
                placeholder="Search here..."
                placeholderTextColor="#888"
                value={search}
                onChangeText={setSearch}
              />

              {search?.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearch('')}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: [{ translateY: -12 }],
                  }}
                >
                  <MaterialIcons name="close" size={20} color="#888" />
                </TouchableOpacity>
              )}
            </View>

            {loader ? (
              <FullViewLoader />
            ) : (
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                {options?.length > 0 ? (
                  options?.map((opt: any, i: number) => {
                    const entries = Object.entries(opt).filter(
                      ([key]) => !key.toLowerCase().includes('id'),
                    );

                    const isGrid = entries.length >= 3;

                    return (
                      <TouchableOpacity
                        key={i}
                        style={[styles.option, { paddingVertical: 12 }]}
                        onPress={() => handleSelect(opt)}
                      >
                        <View
                          style={{
                            flexDirection: isGrid ? 'row' : 'column',
                            flexWrap: isGrid ? 'wrap' : 'nowrap',
                          }}
                        >
                          {entries?.map(([key, value], idx) => (
                            <View
                              key={idx}
                              style={{
                                width: isGrid ? '33.33%' : '100%',
                                paddingVertical: 4,
                                paddingHorizontal: 6,
                              }}
                            >
                              <Text
                                style={{
                                  color:
                                    key === label?.toLowerCase()
                                      ? ERP_COLOR_CODE.ERP_APP_COLOR
                                      : '#000',
                                  fontSize: key === label?.toLowerCase() ? 16 : 14,
                                  fontWeight: key === label?.toLowerCase() ? '700' : '400',
                                }}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                {String(value)}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View
                    style={{
                      marginVertical: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 100,
                    }}
                  >
                    <Text>No data</Text>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {errors[item.field] && (
        <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR, marginTop: 4 }}>{errors[item?.field]}</Text>
      )}
    </View>
  );
};

export default React.memo(AjaxPicker);
