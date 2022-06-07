import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from 'react-native-vector-icons';
import useHelp from 'hooks/useHelp';

const HelpIcon = ({ url }) => {
  const open = useHelp(url);
  return (
    <TouchableOpacity onPress={open}>
      <AntDesign name='questioncircleo' size={22} style={{ marginRight: 15, marginTop: 3 }} />
    </TouchableOpacity>
  );
};

export default HelpIcon;
