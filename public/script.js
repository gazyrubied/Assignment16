const getPlayers = async () => {
    try {
        return (await fetch("api/players")).json();
    } catch (error) {
        console.log(error);
    }
};

const showPlayers = async () => {
    let players = await getPlayers();
    let playersDiv = document.getElementById("player-list");
    playersDiv.innerHTML = "";
    players.forEach((player) => {
        const section = document.createElement("section");
        section.classList.add("player");
        playersDiv.append(section);

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
    dLink.innerHTML = "&#x2715;";
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

    // Get achievements
    formData.set("achievements", getAchievements());

    try {
        if (form._id.value == -1) {
            formData.delete("_id");
            const response = await fetch("api/players", {
                method: "POST",
                body: formData,
            });

            if (response.status !== 200) {
                const errorData = await response.json();
                displayErrorMessage(errorData.message);
                console.log("Error with data", errorData);
                return;
            }

            const newPlayer = await response.json();
            displayDetails(newPlayer);
        } else {
            const response = await fetch(`/api/players/${form._id.value}`, {
                method: "PUT",
                body: formData,
            });

            if (response.status !== 200) {
                const errorData = await response.json();
                displayErrorMessage(errorData.message);
                console.log("Error updating player", errorData);
                return;
            }

            const updatedPlayer = await response.json();
            displayDetails(updatedPlayer);
        }

        resetForm();
        document.querySelector(".dialog").classList.add("transparent");
        showPlayers();
    } catch (error) {
        console.error("Error:", error);
        displayErrorMessage("An unexpected error occurred.");
    }
};

const displayErrorMessage = (message) => {
    const errorMessageElement = document.getElementById("error-message");
    errorMessageElement.textContent = message;
};

const showDeleteConfirmation = (player) => {
    const confirmDelete = window.confirm("Do you want to delete this player?");

    if (confirmDelete) {
        deletePlayer(player);
    }
};

const deletePlayer = async (player) => {
    let response = await fetch(`/api/players/${player._id}`, {
        method: "DELETE",
    });

    if (response.status != 200) {
        console.log("Error deleting");
        return;
    }

    showPlayers();
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
    showPlayers();
    document.getElementById("add-edit-player-form").onsubmit = addEditPlayer;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("add-achievement").onclick = addAchievement;
};
