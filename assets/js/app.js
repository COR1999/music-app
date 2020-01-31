let baseUrl = "https://ws.audioscrobbler.com"
let apiKey = "977e2d82b14fe34163d15b95f2c1ce55"
let dropdownValue;



$(document).ready(function () {

})



function GetSelectedValue() {
    let e = document.getElementById("option-menu");
    let result = e.options[e.selectedIndex].value;
    $(e).focus();
    $(result).toggleClass('active');
    console.log(result);
    searchTheAPI(result);
}


function searchTheAPI(result) {

    // $("#artist-list").empty()
    // $("#album-list").empty()
    // $("#track-list").empty()

    let input;
    let searchType = result;
    console.log(searchType);

    input = $("#myInput").val();
    if (searchType === "album") {
        apiUrl(searchType, input)
            .then(function (response) {
                // console.log(response)
                let albumArray = response.results.albummatches.album;
                // let newAlbumArray = [];
                let rows = [];
                let cardRow = [];
                let NumberPerRow = 3;
                let trackOuter = [];
                albumArray.forEach(function (album, index) {
                    let imageIndex = 2;
                    let albumImage = `<img src="${album.image[imageIndex]["#text"]}">`
                    // console.log(album.artist)
                    if (album.image.length >= 2) {
                        if (album.image[imageIndex]["#text"] === "") {
                            // console.log("working" album.artist);
                            albumImage = `<img class="no-imagesizeing" src="assets/images/no-image-available.png">`
                        }
                    }
                    cardRow.push(`<div class="card col-sm-12 col-md-12 col-lg-4">${albumImage}<h1>${album.artist}</h1><p class="title">${album.name}</p><button id="view-songs${index}">View Songs For This album</button></div>`)
                    if ((index + 1) % NumberPerRow === 0 || (index + 1) === albumArray.length) {
                        // cardRow.push(`<div class="card">${albumImage}<h1>${album.artist}</h1><p class="title">${album.name}</p></div>`)
                        rows.push(`<div class="row">${cardRow}</div>`);
                        cardRow.length = 0;
                        // console.log("rows:", rows)
                        // console.log("cardRow:", cardRow)
                        // console.log(index)
                    }
                    $.ajax({
                        "async": true,
                        "crossDomain": true,
                        "url": `${baseUrl}/2.0/?method=album.getinfo&api_key=${apiKey}&artist=${album.artist}&album=${album.name}&format=json`,
                        "method": "GET",
                    }).then(function (data) {
                        let arrayOfTracks = data.album.tracks.track;
                        // console.log(data.album.tracks.track)
                        let trackArray = [];

                        arrayOfTracks.forEach(function (track) {
                            // console.log(track)
                            // console.log(track.name)
                            // console.log(album.name)
                            $(`#view-songs${index}`).on("click", function () {
                                // console.log("index", index)
                                // console.log("track:", track.name)
                                trackArray.push(`<li>${track.name}<br>Duration: ${track.duration}</li>`)

                                // console.log(trackArray);
                                // trackOuter.push(`<div  id="${index}"><p>${track.name}</p></div>`)
                                console.log(arrayOfTracks)

                                $(".artist-cards").html(`<div class="album-songs">${albumImage}<ul class="list-songs">${trackArray}</ul></div>`.replace(/,/g, ""))
                            })
                            // if (track.name === arrayOfTracks) {
                            //     console.log(track.name)
                            // }
                        })
                    })

                })



                // console.log("rows:", rows)
                // console.log("cardRow:", cardRow)
                // console.log(newAlbumArray);

                // $("#artist-songs").html(`${trackOuter}`.replace(/,/g, ""))
                $(".artist-cards").html(`${rows}`.replace(/,/g, ""))
            })
    } else if (searchType === "song") {
        apiUrl(searchType, input)
            .then(function (response) {
                let trackArray = response.results.trackmatches.track;
                let newTrackArray = [];
                trackArray.forEach(function (track) {
                    newTrackArray.push(`<div class=""><h4>Song Name: ${track.name}</h4><p>Artist: ${track.artist}<br>
                    Total listens: ${track.listeners}</p>`)
                })
                $("#track-list").html(newTrackArray);

                console.log(response.results.trackmatches);
            })
    } else if (searchType === "chart") {
        apiUrl(searchType)
            .then(function (response) {
                // console.log(response.tracks.track);
            })
    }
    // searchType.clear();
    // console.log(searchType);
    dropdownValue = "";
    // })


}
function apiUrl(searchType, input) {

    let searchBy;
    switch (searchType) {
        case "artist":
            searchBy = "artist.search&artist=";
            break;
        case "album":
            searchBy = "album.search&album=";
            break;
        case "song":
            searchBy = "track.search&track=";
            break;
        case "chart":
            searchBy = "chart.gettoptracks";
            input = "";
            break;
        default:
            console.log("unkown Input", searchBy);
        // code block
    }
    console.log("search ", searchType)

    return (
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": `${baseUrl}/2.0/?method=${searchBy}${input}&api_key=${apiKey}&limit=22&format=json`,
            "method": "GET",
        }))
}

//https://codepen.io/cristinaconacel/pen/ePVMME


// function albumAndArtist(album) {
//     $.ajax({
//         "async": true,
//         "crossDomain": true,
//         "url": `${baseUrl}/2.0/?method=album.getinfo&api_key=${apiKey}&artist=${album.artist}&album=${album.name}&format=json`,
//         "method": "GET",
//     }).then(function (data) {
//         console.log(data);
//     })
// }