import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const ScanOverlay = React.memo(() => (
    <View style={StyleSheet.absoluteFill}>
      <View style={overlayStyles.overlayTop} />
      <View style={overlayStyles.centerRow}>
        <View style={overlayStyles.overlaySide} />
        <View style={overlayStyles.scanArea} />
        <View style={overlayStyles.overlaySide} />
      </View>
      <View style={overlayStyles.overlayBottom}>
        <Text style={overlayStyles.scanText}>Align barcode within frame</Text>
      </View>
    </View>
  ));

  const overlayStyles = StyleSheet.create({
    overlaySide: {
        width: '10%',  // Matches regionOfInterest x value
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    overlayBottom: {
        height: '35%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        paddingTop: 20,
    },
    scanArea: {
        width: '80%',  // Matches regionOfInterest width
        height: '100%',
        borderColor: '#fff',
        borderWidth: 2,
    },
    overlayTop: {
        height: '35%',  // Matches regionOfInterest y value
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    centerRow: {
    flexDirection: 'row',
    height: '30%',  // Matches regionOfInterest height
    },
    scanText: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 4,
    overflow: 'hidden',
    }
});
export default ScanOverlay;