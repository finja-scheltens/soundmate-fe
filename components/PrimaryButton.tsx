import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { AppColors } from '../constants/AppColors';
interface Props {
    onPress: () => void
    title?: string
}


export default function PrimaryButton({ onPress, title }: Props
) {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        elevation: 3,
        backgroundColor: AppColors.PRIMARY,
        width: '90%',
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Inter-SemiBold'
    },
});