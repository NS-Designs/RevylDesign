import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

type Spool = { id: string; name: string; material: string; remaining: number };
type Screen = 'list' | 'add' | 'detail';

export default function App() {
  const [spools, setSpools] = useState<Spool[]>([
    { id: '1', name: 'Galaxy Black', material: 'PLA', remaining: 1000 },
  ]);
  const [screen, setScreen] = useState<Screen>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [material, setMaterial] = useState('PLA');
  const [used, setUsed] = useState('');

  const selected = spools.find((s) => s.id === selectedId);

  const addSpool = () => {
    if (!name.trim()) return;
    setSpools([
      ...spools,
      { id: Date.now().toString(), name: name.trim(), material: material.trim() || 'PLA', remaining: 1000 },
    ]);
    setName('');
    setMaterial('PLA');
    setScreen('list');
  };

  const logPrint = () => {
    const grams = Number(used);
    if (!selected || !grams || grams <= 0) return;
    setSpools(
      spools.map((s) =>
        s.id === selected.id ? { ...s, remaining: Math.max(0, s.remaining - grams) } : s
      )
    );
    setUsed('');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {screen === 'list' && (
        <>
          <Text style={styles.title}>My Spools</Text>
          <FlatList
            data={spools}
            keyExtractor={(s) => s.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.card}
                onPress={() => {
                  setSelectedId(item.id);
                  setScreen('detail');
                }}
              >
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text>
                  {item.material} · {item.remaining} g left
                  {item.remaining < 200 ? '  ⚠ Low' : ''}
                </Text>
              </Pressable>
            )}
          />
          <Pressable style={styles.button} onPress={() => setScreen('add')}>
            <Text style={styles.buttonText}>Add spool</Text>
          </Pressable>
        </>
      )}

      {screen === 'add' && (
        <>
          <Text style={styles.title}>Add Spool</Text>
          <TextInput style={styles.input} placeholder="Spool name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Material (PLA, PETG...)" value={material} onChangeText={setMaterial} />
          <Pressable style={styles.button} onPress={addSpool}>
            <Text style={styles.buttonText}>Save spool</Text>
          </Pressable>
          <Pressable style={styles.link} onPress={() => setScreen('list')}>
            <Text>Cancel</Text>
          </Pressable>
        </>
      )}

      {screen === 'detail' && selected && (
        <>
          <Text style={styles.title}>{selected.name}</Text>
          <Text style={styles.big}>{selected.remaining} g remaining</Text>
          {selected.remaining < 200 && <Text style={styles.warn}>Low filament: order a new spool</Text>}
          <TextInput
            style={styles.input}
            placeholder="Grams used by this print"
            keyboardType="numeric"
            value={used}
            onChangeText={setUsed}
          />
          <Pressable style={styles.button} onPress={logPrint}>
            <Text style={styles.buttonText}>Log print</Text>
          </Pressable>
          <Pressable style={styles.link} onPress={() => setScreen('list')}>
            <Text>Back to spools</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 70, paddingHorizontal: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
  card: { padding: 16, borderRadius: 10, backgroundColor: '#f2f2f2', marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#4f46e5', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  link: { alignItems: 'center', padding: 14 },
  big: { fontSize: 22, marginBottom: 12 },
  warn: { color: '#b91c1c', marginBottom: 12 },
});
