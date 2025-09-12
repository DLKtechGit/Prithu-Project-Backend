import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '@react-navigation/native';
import { COLORS, SIZES } from '../../constants/theme';

const BasicLineChart = () => {

    const { colors } : {colors : any} = useTheme();

    return (
        <>
            <LineChart
                data={{
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                    datasets: [
                        {
                        data: [
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100
                        ]
                        }
                    ]
                }}
                transparent={true}
                width={SIZES.width > SIZES.container ? SIZES.container - 60 : SIZES.width - 60} // from react-native
                height={220}
                yAxisLabel="$"
                yAxisSuffix="k"
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: () =>  COLORS.primary,
                    labelColor: () => colors.text,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: colors.card,
                    },
                    propsForBackgroundLines: {
                        stroke: colors.text,
                        strokeOpacity: .3,
                    }
                }}
                bezier
                style={{
                    marginVertical: 8,
                }}
            />
        </>
    );
};



export default BasicLineChart;