import { type SvgIconComponent } from "@mui/icons-material";
import {
  alpha,
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";

export type DashboardCardType = {
  title?: string;
  displayData?: string;
  icon?: SvgIconComponent;
  color?: "error" | "warning" | "info" | "success" | "primary";
};

export const DashboardCard = ({
  title,
  displayData,
  icon: Icon,
  color = "primary",
}: DashboardCardType) => {
  return (
    <Card
      sx={(theme) => {
        const palette = theme.palette[color];

        return {
          border: `1px solid ${palette.main}`,
          backgroundColor: alpha(palette.main, 0.08),
          color: palette.dark,
          borderRadius: 2,
        };
      }}
    >
      <CardHeader
        slotProps={{
          title: {
            sx: {
              fontSize: 16,
              opacity: 0.6,
            },
          },
        }}
        title={title}
      />
      <CardContent sx={{ pt: 0 }}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5">{displayData}</Typography>
          {Icon && <Icon sx={{ opacity: 0.8 }} fontSize="large" />}
        </Box>
      </CardContent>
    </Card>
  );
};
