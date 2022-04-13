const getColor = (rating, numRatings) => {
    const red = '#FF0000';
    const yellow = '#FFFF00'
    const green = '#00FF00';
    const grey = '#808080';

    /*
    console.log('Red: ' + red + '\n' +
                'Yellow: ' + yellow + '\n' +
                'Green: ' + green + '\n' +
                'Grey: ' + grey + '\n' +
                'Rating: ' + rating + '\n' +
                'Number of Ratings: ' + numRatings)
    */

    let ratingPercent = (rating / 5.0) - 0.1

    //console.log('Rating Percent:' + ratingPercent)

    let ratingColor
    if(ratingPercent < 0.5) {
        ratingColor = blendColors(red, yellow, ratingPercent * 2)
    } else {
        ratingColor = blendColors(yellow, green, (ratingPercent - 0.5) * 2)
    }

    //console.log('Rating Color: ' + ratingColor)

    if(numRatings < 5) {
        let geryblend = (numRatings / 5.0) - 0.1

        //console.log('Percent rating showing: ' + geryblend)

        ratingColor = blendColors(grey, ratingColor, geryblend)
    }

    //console.log('Final Rating Color: ' + ratingColor)

    return ratingColor
}

const blendColors = (color1, color2, percentage) => {
    //console.log('Percent of color 2 mixed in:' + percentage)

    color1RGB = [parseInt(color1[1] + color1[2], 16), parseInt(color1[3] + color1[4], 16), parseInt(color1[5] + color1[6], 16)];
    color2RGB = [parseInt(color2[1] + color2[2], 16), parseInt(color2[3] + color2[4], 16), parseInt(color2[5] + color2[6], 16)];

    let color3RGB = [ 
        (1 - percentage) * color1RGB[0] + percentage * color2RGB[0], 
        (1 - percentage) * color1RGB[1] + percentage * color2RGB[1], 
        (1 - percentage) * color1RGB[2] + percentage * color2RGB[2]
    ];

    let color3 = '#' + intToHex(color3RGB[0]) + intToHex(color3RGB[1]) + intToHex(color3RGB[2]);

    return color3
}

const intToHex = (num) => {
    let hex = Math.round(num).toString(16);
    if (hex.length == 1)
        hex = '0' + hex;
    return hex;
}

module.exports = getColor