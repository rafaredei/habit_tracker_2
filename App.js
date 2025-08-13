import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function App() {
  const [habits, setHabits] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [habitNameInput, setHabitNameInput] = useState("");
  const [habitTimeInput, setHabitTimeInput] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const openModal = (habit = null) => {
    setHabitNameInput(habit ? habit.name : "");
    setHabitTimeInput(habit ? new Date(habit.time) : new Date());
    setCurrentEdit(habit);
    setModalVisible(true);
  };

  const submitHabit = () => {
    if (!habitNameInput.trim()) return;

    const newHabitData = {
      id: currentEdit ? currentEdit.id : Date.now().toString(),
      name: habitNameInput,
      time: habitTimeInput.toISOString(),
      completed: currentEdit ? currentEdit.completed : false,
    };

    if (currentEdit) {
      setHabits(habits.map((h) => (h.id === currentEdit.id ? newHabitData : h)));
    } else {
      setHabits([...habits, newHabitData]);
    }

    setModalVisible(false);
  };

  const deleteHabit = (id) => {
    Alert.alert(
      "Delete Habit",
      "Are you sure you want to delete this habit?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => setHabits(habits.filter((h) => h.id !== id)),
        },
      ]
    );
  };

  const toggleHabit = (id) => {
    setHabits(
      habits.map((h) =>
        h.id === id ? { ...h, completed: !h.completed } : h
      )
    );
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) setHabitTimeInput(selectedTime);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Habit Tracker</Text>

      <View style={{ padding: 20 }}>
        {habits.map((item) => {
          const timeString = new Date(item.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.habitTile, { backgroundColor: item.completed ? "#4caf50" : "#2196f3" }]}
              onPress={() => toggleHabit(item.id)}
            >
              <Text style={styles.habitText}>{item.name}</Text>
              <Text style={styles.deadlineText}>Deadline: {timeString}</Text>

              <View style={{ flexDirection: "row", position: "absolute", top: 10, right: 10 }}>
                <TouchableOpacity style={styles.editButton} onPress={() => openModal(item)}>
                  <Text style={{ color: "#fff" }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteHabit(item.id)}>
                  <Text style={{ color: "#fff" }}>🗑</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{currentEdit ? "Edit Habit" : "New Habit"}</Text>

            <TextInput
              style={styles.input}
              value={habitNameInput}
              onChangeText={setHabitNameInput}
              placeholder="Habit name"
            />

            <Text style={{ alignSelf: "flex-start", marginBottom: 5 }}>Deadline:</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timeText}>
                {habitTimeInput.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={habitTimeInput}
                mode="time"
                display="spinner"
                onChange={onTimeChange}
              />
            )}

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity style={styles.modalButton} onPress={submitHabit}>
                <Text style={styles.modalButtonText}>{currentEdit ? "Save" : "Add"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginVertical: 15 },
  habitTile: {
    height: 100,
    borderRadius: 16,
    marginBottom: 15,
    padding: 15,
    justifyContent: "center",
    position: "relative",
  },
  habitText: { fontSize: 20, color: "#fff", fontWeight: "600" },
  deadlineText: { fontSize: 14, color: "#fff", marginTop: 5 },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#2196f3",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: { fontSize: 32, color: "#fff", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  timeButton: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#eef",
    marginBottom: 10,
    alignItems: "center",
  },
  timeText: { fontSize: 16 },
  modalButton: {
    backgroundColor: "#2196f3",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  editButton: {
    backgroundColor: "#555",
    padding: 5,
    borderRadius: 6,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#d11a2a",
    padding: 5,
    borderRadius: 6,
  },
});
