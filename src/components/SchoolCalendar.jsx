import React, { useEffect, useState } from "react";
import {
  Box,
  Badge,
  Typography,
  Paper,
  List,
  ListItem,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useMediaQuery,
} from "@mui/material";
import {
  LocalizationProvider,
  DateCalendar,
  PickersDay,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";
import { getCalendarEvents } from "../actions/calendar";
import { useDispatch } from "react-redux";

// ✅ Custom Day Component
function CustomDay(props) {
  const {
    day,
    outsideCurrentMonth,
    events = [],
    onSelectDate,
    selectedDate,
    ...other
  } = props;

  const isEventDay = events.some((event) =>
    dayjs(event.start_date).isSame(day, "day")
  );

  const isSelected = selectedDate && day.isSame(selectedDate, "day");

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      color={isSelected ? "secondary" : "primary"}
      variant={isEventDay ? "dot" : "standard"}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        onClick={() => onSelectDate(day)}
        sx={{
          bgcolor: isSelected ? "primary.main" : "transparent",
          color: isSelected ? "white" : "inherit",
          borderRadius: "50%",
          "&:hover": { bgcolor: isSelected ? "primary.dark" : "#f5f5f5" },
          transition: "all 0.2s ease-in-out",
        }}
      />
    </Badge>
  );
}

export default function SchoolCalendar({calendarData}) {
  const [events, setEvents] = useState(calendarData);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

    const fetchEvents = async () => {
      try {
        const result = await dispatch(getCalendarEvents());
        setEvents(result.data || []);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
  useEffect(() => {
    fetchEvents();
  }, [calendarData]);

  const handleDateSelect = (day) => {
    setSelectedDate(day);

    // Filter only events on the same date (ignores time)
    const filtered = events.filter((event) =>
      dayjs(event.start_date).isSame(day, "day")
    );

    setSelectedEvents(filtered);
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: isMobile ? 2 : 4,
          bgcolor: "#f5f7fa",
          minHeight: "70vh",
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 500,
            borderRadius: 4,
            boxShadow: "0px 6px 18px rgba(0,0,0,0.1)",
            bgcolor: "background.paper",
          }}
        >
          <CardHeader
            title="📅 School Calendar"
            subheader="View important academic dates and events"
            sx={{
              bgcolor: "primary.main",
              color: "white",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              textAlign: "center",
              py: 2,
            }}
          />
          <Divider />

          <CardContent>
            <DateCalendar
              value={selectedDate}
              onChange={handleDateSelect}
              sx={{
                mx: "auto",
                "& .MuiPickersDay-root": {
                  fontWeight: 500,
                },
              }}
              slots={{
                day: (dayProps) => (
                  <CustomDay
                    {...dayProps}
                    events={events}
                    onSelectDate={handleDateSelect}
                    selectedDate={selectedDate}
                  />
                ),
              }}
            />

            {selectedEvents.length > 0 && (
              <Paper
                elevation={2}
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#f9fafc",
                  borderLeft: "4px solid",
                  borderColor: "primary.main",
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 1, color: "primary.main" }}
                >
                  📌 Events on {dayjs(selectedDate).format("MMMM D, YYYY")}
                </Typography>
                <List dense>
                  {selectedEvents.map((event, index) => (
                    <ListItem key={event.id || index}>
                      <Box>
                        <Typography fontWeight="bold">{event.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {event.description}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}

            {selectedDate && selectedEvents.length === 0 && (
              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  color: "text.secondary",
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                No events on {dayjs(selectedDate).format("MMMM D, YYYY")}.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
