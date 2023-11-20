const getSoccerPlayers = async () => {
    try {
        return (await fetch("api/soccerPlayers")).json();
    } catch (error) {
        console.log(error);
    }
};

const showSoccerPlayers = async () => {
    let soccerPlayers = await getSoccerPlayers();
    let soccerPlayersDiv = document.getElementById("player-list");
    soccerPlayersDiv.innerHTML = "";
    soccerPlayers.forEach((player) => {
        const section = document.createElement("section");
        section.classList.add("player");
        soccerPlayersDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = player.name;
        a.append(h3);

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(player);
        };
    });
};

const displayDetails = (player) => {
    const playerDetails = document.getElementById("player-details");
    playerDetails.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = player.name;
    playerDetails.append(h3);

    const img = document.createElement("img");
    img.src = player.img;  
    img.alt = player.name;  
    img.classList.add("player-image");
    playerDetails.append(img);

    const dLink = document.createElement("a");
    dLink.innerHTML = "	&#x2715;";
    playerDetails.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    playerDetails.append(eLink);
    eLink.id = "edit-link";

    const p = document.createElement("p");
    playerDetails.append(p);
    p.innerHTML = `Team: ${player.team}, Position: ${player.position}, Nationality: ${player.nationality}, Goals Scored: ${player.goalsScored}, Assists: ${player.assists}`;

    const ul = document.createElement("ul");
    playerDetails.append(ul);
    player.achievements.forEach((achievement) => {
        const li = document.createElement("li");
        ul.append(li);
        li.innerHTML = achievement;
    });

    eLink.onclick = (e) => {
        e.preventDefault();
        showEditForm(player);
    };

    dLink.onclick = (e) => {
        e.preventDefault();
        showDeleteConfirmation(player);
    };
};

const showEditForm = (player) => {
    const form = document.getElementById("add-edit-player-form");
    form._id.value = player._id; 
    form.name.value = player.name;
    form.team.value = player.team;
    form.position.value = player.position;
    form.nationality.value = player.nationality;
    form.goalsScored.value = player.goalsScored;
    form.assists.value = player.assists;

    const achievementBoxes = document.getElementById("achievement-boxes");
    achievementBoxes.innerHTML = "";
    player.achievements.forEach((achievement) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = achievement;
        achievementBoxes.appendChild(input);
    });

    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").innerHTML = "Edit Player";
};

const addEditPlayer = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-edit-player-form");
    const formData = new FormData(form);
    let response;

    formData.append("achievements", getAchievements());

    try {
        if (form._id.value == -1) {
            formData.delete("_id");
            formData.delete("img");

            response = await fetch("api/soccerPlayers", {
                method: "POST",
                body: formData,
            });
        } else {
            console.log(...formData);
            response = await fetch(`/api/soccerPlayers/${form._id.value}`, {
                method: "PUT",
                body: formData,
            });
        }

        if (response.status !== 200) {
            console.log("Error with data");
        }

        const updatedPlayer = await response.json();

        if (form._id.value != -1) {
            displayDetails(updatedPlayer);
        }

        resetForm();
        document.querySelector(".dialog").classList.add("transparent");
        showSoccerPlayers();
    } catch (error) {
        console.error("Error:", error);
    }
};

const showDeleteConfirmation = (player) => {
    const confirmDelete = window.confirm("Do you want to delete this player?");

    if (confirmDelete) {
        deletePlayer(player);
    }
};

const deletePlayer = async (player) => {
    let response = await fetch(`/api/soccerPlayers/${player._id}`, {
        method: "DELETE",
    });

    if (response.status != 200) {
        console.log("Error deleting");
        return;
    }

    showSoccerPlayers();
    document.getElementById("player-details").innerHTML = "";
    resetForm();
};

const getAchievements = () => {
    const inputs = document.querySelectorAll("#achievement-boxes input");
    let achievements = [];

    inputs.forEach((input) => {
        achievements.push(input.value);
    });

    return achievements;
};

const resetForm = () => {
    const form = document.getElementById("add-edit-player-form");
    form.reset();
    form._id = "-1";
    document.getElementById("achievement-boxes").innerHTML = "";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").innerHTML = "Add Player";
    resetForm();
};

const addAchievement = (e) => {
    e.preventDefault();
    const section = document.getElementById("achievement-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
};

window.onload = () => {
    showSoccerPlayers();
    document.getElementById("add-edit-player-form").onsubmit = addEditPlayer;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("add-achievement").onclick = addAchievement;
};
