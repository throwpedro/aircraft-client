import {
  Box,
  CircularProgress,
  Typography,
  type CircularProgressProps,
} from "@mui/material";

export const CircularProgressWithLabel = (
  props: CircularProgressProps & { value: number } & { label?: string },
) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress size={60} variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: "text.secondary" }}
        >
          {props.label || `${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};
