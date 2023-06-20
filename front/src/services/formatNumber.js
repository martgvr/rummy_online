export const formatNumber = (number) => {
    let colorToShow, numberToShow

    if ((number >= 1) && (number <= 13)) { numberToShow = number }
    if ((number >= 14) && (number <= 26)) { numberToShow = number - 13 }
    if ((number >= 27) && (number <= 39)) { numberToShow = number - 26 }
    if ((number >= 40) && (number <= 52)) { numberToShow = number - 39 }
    if ((number >= 53) && (number <= 65)) { numberToShow = number - 52 }
    if ((number >= 66) && (number <= 78)) { numberToShow = number - 65 }
    if ((number >= 79) && (number <= 91)) { numberToShow = number - 78 }
    if ((number >= 92) && (number <= 104)) { numberToShow = number - 91 }
    if (number == 105) { numberToShow = 'C' }
    if (number == 106) { numberToShow = 'C' }

    if ((number >= 1) && (number <= 26)) { colorToShow = '#c7141a' }
    if ((number >= 27) && (number <= 52)) { colorToShow = '#0068a8' }
    if ((number >= 53) && (number <= 78)) { colorToShow = '#b09e00' }
    if ((number >= 79) && (number <= 104)) { colorToShow = '#222' }

    return { colorToShow, numberToShow }
}