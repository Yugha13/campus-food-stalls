import { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomTimeModal({
  visible,
  onClose,
  onSelectTime,
  isDark,
}) {
  const insets = useSafeAreaInsets();
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedMinute, setSelectedMinute] = useState(null);
  const [availableHours, setAvailableHours] = useState([]);
  const [availableMinutes, setAvailableMinutes] = useState([]);

  // Generate available hours from current time until 10 PM
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const hours = [];
    for (let i = currentHour; i <= 22; i++) {
      hours.push(i);
    }
    
    setAvailableHours(hours);
    setSelectedHour(currentHour);
    
    // Generate minutes in 5-minute increments
    updateAvailableMinutes(currentHour);
  }, []);

  // Update available minutes when hour changes
  const updateAvailableMinutes = (hour) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    let minutes = [];
    // If selected hour is current hour, start from next 5-minute increment
    if (hour === currentHour) {
      const startMinute = Math.ceil(currentMinute / 5) * 5;
      for (let i = startMinute; i < 60; i += 5) {
        minutes.push(i);
      }
    } else {
      // For future hours, show all 5-minute increments
      for (let i = 0; i < 60; i += 5) {
        minutes.push(i);
      }
    }
    
    setAvailableMinutes(minutes);
    setSelectedMinute(minutes.length > 0 ? minutes[0] : null);
  };

  const handleHourSelect = (hour) => {
    setSelectedHour(hour);
    updateAvailableMinutes(hour);
  };

  const handleMinuteSelect = (minute) => {
    setSelectedMinute(minute);
  };

  const handleConfirm = () => {
    if (selectedHour !== null && selectedMinute !== null) {
      const formattedHour = selectedHour % 12 || 12;
      const amPm = selectedHour >= 12 ? 'PM' : 'AM';
      const formattedMinute = selectedMinute.toString().padStart(2, '0');
      const timeString = `${formattedHour}:${formattedMinute} ${amPm}`;
      onSelectTime(timeString);
      onClose();
    }
  };

  const formatHour = (hour) => {
    const formattedHour = hour % 12 || 12;
    const amPm = hour >= 12 ? 'PM' : 'AM';
    return `${formattedHour} ${amPm}`;
  };

  const formatMinute = (minute) => {
    return minute.toString().padStart(2, '0');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.modalContainer,
          {
            backgroundColor: isDark ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)",
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: isDark ? "#121212" : "#FFFFFF",
            },
          ]}
        >
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              Select Custom Time
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeButton,
                { backgroundColor: isDark ? "#2A2A2A" : "#F3F4F6" },
              ]}
            >
              <X size={16} color={isDark ? "#E5E7EB" : "#374151"} />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.subtitle,
              { color: isDark ? "#9CA3AF" : "#6B7280" },
            ]}
          >
            Select hour
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timeOptionsContainer}
          >
            {availableHours.map((hour) => (
              <TouchableOpacity
                key={`hour-${hour}`}
                onPress={() => handleHourSelect(hour)}
                style={[
                  styles.timeOption,
                  {
                    backgroundColor:
                      selectedHour === hour
                        ? "#22C55E"
                        : isDark
                        ? "#2A2A2A"
                        : "#F3F4F6",
                    borderColor:
                      selectedHour === hour
                        ? "#22C55E"
                        : isDark
                        ? "#333333"
                        : "#E5E7EB",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.timeText,
                    {
                      color:
                        selectedHour === hour
                          ? "#FFFFFF"
                          : isDark
                          ? "#E5E7EB"
                          : "#374151",
                    },
                  ]}
                >
                  {formatHour(hour)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text
            style={[
              styles.subtitle,
              { color: isDark ? "#9CA3AF" : "#6B7280", marginTop: 16 },
            ]}
          >
            Select minute
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timeOptionsContainer}
          >
            {availableMinutes.map((minute) => (
              <TouchableOpacity
                key={`minute-${minute}`}
                onPress={() => handleMinuteSelect(minute)}
                style={[
                  styles.timeOption,
                  {
                    backgroundColor:
                      selectedMinute === minute
                        ? "#22C55E"
                        : isDark
                        ? "#2A2A2A"
                        : "#F3F4F6",
                    borderColor:
                      selectedMinute === minute
                        ? "#22C55E"
                        : isDark
                        ? "#333333"
                        : "#E5E7EB",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.timeText,
                    {
                      color:
                        selectedMinute === minute
                          ? "#FFFFFF"
                          : isDark
                          ? "#E5E7EB"
                          : "#374151",
                    },
                  ]}
                >
                  {formatMinute(minute)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.selectedTimeContainer}>
            <Text
              style={[
                styles.selectedTimeLabel,
                { color: isDark ? "#9CA3AF" : "#6B7280" },
              ]}
            >
              Selected time:
            </Text>
            <Text
              style={[
                styles.selectedTime,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              {selectedHour !== null && selectedMinute !== null
                ? `${formatHour(selectedHour)}:${formatMinute(selectedMinute)}`
                : "--:--"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleConfirm}
            style={styles.confirmButton}
            disabled={selectedHour === null || selectedMinute === null}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    marginBottom: 12,
  },
  timeOptionsContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 8,
  },
  timeOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  selectedTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  selectedTimeLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginRight: 8,
  },
  selectedTime: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  confirmButton: {
    backgroundColor: "#22C55E",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
});