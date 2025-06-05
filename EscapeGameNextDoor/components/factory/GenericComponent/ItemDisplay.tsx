import { FC } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { LockClockOutlined } from "@mui/icons-material";

interface ItemDisplayProps {
  letter?: string;
  name?: string;
  header?: string;
  img?: string;
  onClick?: () => void;
}

const ItemDisplay: FC<ItemDisplayProps> = ({ letter, name, header, img, onClick }) => {
  const theme = useTheme();
  const Handleclick = () => {
    onClick !== undefined ? onClick() : console.log("Item clicked");
  };
  return (
    <ThemedView>
      <Box
        display="flex"
        flexDirection="row"
        position="relative"
        height={80}
        alignItems="flex-start"
        justifyContent="flex-start"
        borderRadius={2}
        padding={1}
        margin={1}
        sx={{
          backgroundColor: "#17141d", // from .card
          color: "#7a7a8c",           // default text color from .card
          fontFamily: "Inter, sans-serif",
        }}
        onClick={Handleclick}
      >
        {/* Main Content */}
        <Box
          display="flex"
          flexDirection="row"
          flex={1}
          overflow="hidden"
        >
          {/* Left Side */}
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            p={2}
            flex={1}
            gap={2}
          >
            {/* Avatar Circle */}
            <Box
              width={40}
              height={40}
              borderRadius="50%"
              position="relative"
              sx={{
                backgroundColor: "#f2f2f2",
                color: "#000",
              }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="body1" fontWeight={500}>
                <ThemedText>{letter}</ThemedText>
              </Typography>
            </Box>

            {/* Text Info */}
            <Box
              display="flex"
              flexDirection="column"
              gap={0.5}
              flex={1}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#e52e71", // match .author-name-prefix
                  letterSpacing: "0.15px",
                  fontWeight: 600,
                }}
              >
                <ThemedText>{header}</ThemedText>
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#7a7a8c", // match .author-name
                  letterSpacing: "0.25px",
                }}
              >
                <ThemedText>{name}</ThemedText>
              </Typography>
            </Box>
          </Box>

          {/* Right Image Section */}
          <Box
            width={80}
            borderLeft={1}
            borderColor="divider"
            position="relative"
          >
            {
              img === undefined ?
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="100%"
                  height="100%"
                  sx={{
                    backgroundColor: "#f2f2f2",
                    color: "#e52e71",
                  }}
                >
                <LockClockOutlined></LockClockOutlined>
                </Box>:
            <Box
              component="img"
              src={img}
              alt="item"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "0 2px 2px 0",
                background: "linear-gradient(to left, #ece6f0, #ece6f0)",
              }}
            />
            }
          </Box>
        </Box>

        {/* Background Overlay */}
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          borderRadius={2}
          border={1}
          borderColor="divider"
          sx={{
            zIndex: -1,
          }}
        />
      </Box>
    </ThemedView>
  );
};

export default ItemDisplay;
