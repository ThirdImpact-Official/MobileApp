import { FC } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
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
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));

  const Handleclick = () => {
    onClick !== undefined ? onClick() : console.log("Item clicked");
  };

  // Responsive sizes
  const avatarSize = isXs ? 28 : isSm ? 32 : 40;
  const imageWidth = isXs ? 48 : isSm ? 64 : 80;
  const boxHeight = isXs ? 56 : isSm ? 64 : 80;
  const padding = isXs ? 0.5 : 1;

  return (
    <ThemedView>
      <Box
        display="flex"
        flexDirection={isXs ? "column" : "row"}
        position="relative"
        height={boxHeight}
        alignItems={isXs ? "stretch" : "flex-start"}
        justifyContent="flex-start"
        borderRadius={2}
        padding={padding}
        margin={1}
        sx={{
          backgroundColor: "#17141d",
          color: "#7a7a8c",
          fontFamily: "Inter, sans-serif",
          minWidth: 0,
        }}
        onClick={Handleclick}
      >
        {/* Main Content */}
        <Box
          display="flex"
          flexDirection={isXs ? "column" : "row"}
          flex={1}
          overflow="hidden"
        >
          {/* Left Side */}
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            p={isXs ? 1 : 2}
            flex={1}
            gap={isXs ? 1 : 2}
            minWidth={0}
          >
            {/* Avatar Circle */}
            <Box
              width={avatarSize}
              height={avatarSize}
              borderRadius="50%"
              position="relative"
              sx={{
                backgroundColor: "#f2f2f2",
                color: "#000",
                minWidth: avatarSize,
                minHeight: avatarSize,
              }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="body1" fontWeight={500} fontSize={isXs ? 14 : 16}>
                <ThemedText>{letter}</ThemedText>
              </Typography>
            </Box>

            {/* Text Info */}
            <Box
              display="flex"
              flexDirection="column"
              gap={0.5}
              flex={1}
              minWidth={0}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#e52e71",
                  letterSpacing: "0.15px",
                  fontWeight: 600,
                  fontSize: isXs ? 14 : 16,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <ThemedText>{header}</ThemedText>
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#7a7a8c",
                  letterSpacing: "0.25px",
                  fontSize: isXs ? 12 : 14,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <ThemedText>{name}</ThemedText>
              </Typography>
            </Box>
          </Box>

          {/* Right Image Section */}
          <Box
            width={imageWidth}
            minWidth={imageWidth}
            borderLeft={isXs ? 0 : 1}
            borderTop={isXs ? 1 : 0}
            borderColor="divider"
            position="relative"
            height={isXs ? imageWidth : "100%"}
            mt={isXs ? 1 : 0}
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
                  <LockClockOutlined fontSize={isXs ? "small" : "medium"} />
                </Box> :
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
                    borderRadius: isXs ? "0 0 8px 8px" : "0 2px 2px 0",
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
