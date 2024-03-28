import DropDownPicker from 'react-native-dropdown-picker';
import { useState, useEffect } from 'react';



function SearchablePicker({pickerItems, style, containerStyle, searchPlaceholder, placeholder, value, setValue}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(pickerItems);
  const [tValue, setTValue] = useState();

  useEffect(() => { 
    setValue(tValue);
  }, [tValue]);

  return (
    <DropDownPicker style={style}
      containerStyle={containerStyle}
      open={open}
      value={tValue}
      items={items}
      setOpen={setOpen}
      setValue={setTValue}
      setItems={setItems}
      searchable={true}
      searchPlaceholder={searchPlaceholder}
      placeholder={placeholder}
    />
  );
}

export default SearchablePicker;