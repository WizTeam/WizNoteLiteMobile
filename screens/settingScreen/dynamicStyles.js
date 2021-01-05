import { createDeviceDynamicStyles, getDynamicColor } from '../../config/Colors';

export const dynamicStyles = createDeviceDynamicStyles(() => ({
  root: {
    flex: 1,
    backgroundColor: getDynamicColor('settingBackgroundColor'),
  },
  headerTitle: {
    color: getDynamicColor('settingTitleColor'),
    fontSize: 20,
  },
  mainContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  user: {
    marginTop: 20,
    alignItems: 'center',
  },
  vipTime: {
    marginTop: 10,
    color: getDynamicColor('settingFontColor'),
  },
  vipBtn: {
    marginTop: 10,
    marginHorizontal: 15,
  },
  lists: {
    marginTop: 12,
  },
  listName: {
    lineHeight: 30,
    paddingHorizontal: 15,
    color: getDynamicColor('settingFontColor'),
  },
  listLabel: {
    flex: 1,
  },
  listValue: {
    color: getDynamicColor('settingFontColor'),
  },
  commitBtn: {
    marginTop: 30,
  },
}));
