import React, { useState, ReactNode, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <View
      style={[
        styles.tabPanel,
        { display: value !== index ? 'none' : 'flex' }
      ]}
      {...other}
    >
      {value === index && (
        <View style={styles.tabContent}>
          {children}
        </View>
      )}
    </View>
  );
}

export interface TabItem {
  label: string | React.ReactNode;
  content: ReactNode;
}

export interface GenericTabsProps {
  tabs: TabItem[];
  defaultTab?: number;
  ariaLabel?: string;
  ChangeTab?: (arg: number) => void;
  tabStyle?: object;
  activeTabStyle?: object;
  tabTextStyle?: object;
  activeTabTextStyle?: object;
  containerStyle?: object;
}

const GenericTabs = forwardRef<any, GenericTabsProps>(({ 
  tabs, 
  defaultTab = 0, 
  ariaLabel = "generic tabs", 
  ChangeTab,
  tabStyle,
  activeTabStyle,
  tabTextStyle,
  activeTabTextStyle,
  containerStyle
}, ref) => {
  const [value, setValue] = useState(defaultTab);

  useImperativeHandle(ref, () => ({
    changeTab: (tabIndex: number) => {
      setValue((prev) => {
        if (tabIndex >= 0 && tabIndex < tabs.length && tabIndex !== prev) {
          if (ChangeTab) ChangeTab(tabIndex);
          return tabIndex;
        }
        return prev;
      });
    },
    currentTab: () => value
  }));

  const handleTabPress = (index: number) => {
    setValue(index);
    if (ChangeTab) ChangeTab(index);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContentContainer}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tab,
              tabStyle,
              value === index && styles.activeTab,
              value === index && activeTabStyle
            ]}
            onPress={() => handleTabPress(index)}
            accessibilityRole="tab"
            accessibilityState={{ selected: value === index }}
            accessibilityLabel={typeof tab.label === 'string' ? tab.label : `Tab ${index + 1}`}
          >
            {typeof tab.label === 'string' ? (
              <Text style={[
                styles.tabText,
                tabTextStyle,
                value === index && styles.activeTabText,
                value === index && activeTabTextStyle
              ]}>
                {tab.label}
              </Text>
            ) : (
              tab.label
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {tabs.map((tab, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          {tab.content}
        </CustomTabPanel>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  tabsContainer: {
    flexGrow: 0,
  },
  tabsContentContainer: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  tabPanel: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
});

export default GenericTabs;