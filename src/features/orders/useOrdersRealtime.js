import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNewOrders } from "../../contexts/NewOrdersContext";
import supabase from "../../services/supabase";

function useOrdersRealtime() {
    const queryClient = useQueryClient();
    const { incrementNewOrders } = useNewOrders();

    useEffect(() => {
        // Create a simple notification sound using Web Audio API
        const playNotificationSound = () => {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                // Create a pleasant "ding" sound
                oscillator.frequency.value = 800; // Higher frequency for a clear tone
                oscillator.type = "sine";

                // Fade in and out for a smooth sound
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            } catch (error) {
                console.error("Error playing notification sound:", error);
            }
        };

        // Subscribe to realtime changes on the orders table
        const channel = supabase
            .channel("orders-changes")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "orders",
                },
                () => {
                    // Play notification sound
                    playNotificationSound();

                    // Increment badge count
                    incrementNewOrders();

                    // Invalidate orders query to refresh the list
                    queryClient.invalidateQueries({ queryKey: ["orders"] });
                }
            )
            .subscribe();

        // Cleanup subscription on unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient, incrementNewOrders]);
}

export default useOrdersRealtime;