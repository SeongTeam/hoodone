import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { basicFontSize , mdFontSize} from "@/utils/chakra/fonts";
import { customColors } from "@/utils/chakra/customColors";

export type TabItem = {
  ID: string;
};
type TabItemProps = {
  item: TabItem;
  selected: boolean;
  setSelectTab: (value: string) => void;
  borderWidth: string;
};

const Tab: React.FC<TabItemProps> = ({ item, selected, setSelectTab, borderWidth }) => {
  const fontSize = { 
    selected : basicFontSize,
    unselected : mdFontSize,
  }

  return (
    <Flex
      justify="center"
      align="center"
      flexGrow={1}
      p="14px 0px"
      cursor="pointer"
      fontSize = {selected ? fontSize.selected : fontSize.unselected}
      color={selected ? customColors.white[100] : customColors.disableColor[100]}
      borderWidth={borderWidth}
      onClick={() => setSelectTab(item.ID)}
    >
      <Text>{item.ID}</Text>
    </Flex>
  );
};
export default Tab;
