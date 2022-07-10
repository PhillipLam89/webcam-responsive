*{
    margin: 0;
    padding: 0;
    overflow: hidden;
}

.hidden {
    display: none !important;
}

button{
    position: absolute;
    height: 30px;
    left: 50%;
    top: 15px;
    padding: 3.25px;
    background: red;
    transform: translateX(-50%);


}
h6 {
    width: 120px;
    color: chartreuse;
    font-size: 1rem;
    font-weight: 900;
}
#streamDeviceInfo {

    position: absolute;
    top: 10%;
    left: 45%;
    width: 100%;

   z-index: 3;
}
.take-photo {
    position: absolute;
    bottom: 2%;
    left: 50%;
    transform: translateX(-50%);
    background-color: forestgreen;
    border-radius: 50%;
    height: 75px;
    width: 75px;
    padding: .35em;
    cursor: pointer;
    color: white;
    font-weight: 900;
    display: grid;
    place-items: center;
}

.save-photo {
    position: absolute;
    cursor: pointer;
    bottom: 2.5%;
    left: 65%;
    color: white;

    font-weight: 900;
    transform: translateX(-50%);
    background-color: red;
    padding: .5em;

}
