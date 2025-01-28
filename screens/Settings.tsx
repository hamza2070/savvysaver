import React from 'react';
import { View, Alert } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';

import { ListItem } from '../components/ListItem';
import { theme } from '../theme';
import RealmContext from '../realm';
import { stylesGlobal } from '@/styles/styles';

const { useRealm } = RealmContext;
type props ={
  navigation : any
}
export const Settings = ({ navigation } : props) => {
  const realm = useRealm();

  return (
    <View
      style={[{
        padding: 16,
        flex: 1,
        overflow: 'hidden',
      },stylesGlobal.background]}
    >
      <ListItem
        label='Categories'
        detail={
          <Entypo
            name='chevron-thin-right'
            color='white'
            style={{ opacity: 0.3 }}
            size={20}
          />
        }
        onClick={() => {
          navigation.navigate('Categories');
        }}
      />
      <ListItem
        isDestructive
        label='Erase all data'
        onClick={() => {
          Alert.alert(
            'Are you sure?',
            'This action cannot be undone',
            [
              {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
              },
              {
                text: 'Erase data',
                style: 'destructive',
                onPress: () => {
                  realm.write(() => {
                    realm.deleteAll();
                  });
                },
              },
            ],
            {
              userInterfaceStyle: 'dark',
            }
          );
        }}
      />
    </View>
  );
};
