import React, { useState, ReactNode, forwardRef, useImperativeHandle } from 'react';
import { Tabs, Tab } from "@mui/material";
import { Box } from "@mui/material"; // Note: Changed from lucide-react to @mui/material for consistency

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-panel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
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
  ChangeTab?:(arg:number)=>void
}

const GenericTabs = forwardRef(({ tabs, defaultTab = 0, ariaLabel = "generic tabs", ChangeTab }: GenericTabsProps, ref) => {
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
      currentTab: () => value // 👈 Rend currentTab une méthode
    }));
  
    return (
      <Box sx={{ width: '100%' }}>
        <Tabs value={value} onChange={(e, newValue) => setValue(newValue)} aria-label={ariaLabel}>
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} id={`tab-${index}`} aria-controls={`tab-panel-${index}`} />
          ))}
        </Tabs>
        {tabs.map((tab, index) => (
          <CustomTabPanel key={index} value={value} index={index}>{tab.content}</CustomTabPanel>
        ))}
      </Box>
    );
  });
  
  export default GenericTabs;