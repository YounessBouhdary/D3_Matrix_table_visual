import { format } from "d3";

export function formatLargeNumber(value: number, mode: number, currency: string, decimalPlaces: number) {
    if (isNaN(value)) {
        return ''; // Or any other placeholder for NaN values
    }

    let formattedValue: string;

    switch (mode) {
        case 0: {
            formattedValue = format("~s")(value);
            break;
        }
        case 1: {
            formattedValue = value.toFixed(decimalPlaces);
            break;
        }
        case 1000: {
            formattedValue = (value / 1000).toFixed(decimalPlaces) + 'K';
            break;
        }
        case 1000000: {
            formattedValue = (value / 1000000).toFixed(decimalPlaces) + 'M';
            break;
        }
        case 1000000000: {
            formattedValue = (value / 1000000000).toFixed(decimalPlaces) + 'B';
            break;
        }
        case 1000000000000: {
            formattedValue = (value / 1000000000000).toFixed(decimalPlaces) + 'T';
            break;
        }
        default:
            console.log(`Sorry, we are out of ${mode}.`);
            return '';
    }

    if (currency && currency !== "None") {
        switch (currency) {
            case '$':
                formattedValue = '$' + formattedValue;
                break;
            case '€':
                formattedValue = '€' + formattedValue;
                break;
            case '£':
                formattedValue = '£' + formattedValue;
                break;
            default:
                console.log(`Currency ${currency} not supported.`);
                return '';
        }
    }

    // Add comma for thousands separator
    formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return formattedValue;
}
