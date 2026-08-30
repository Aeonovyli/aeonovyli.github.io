const SHIP_PATHS = {
    fighter: "M20,0 L0,40 L20,35 L40,40 Z",
    capital: "M20,0 L0,30 L10,50 L20,45 L30,50 L40,30 Z M15,15 L25,15 L25,25 L15,25 Z"
};

const SHIP_COLORS = {
    enemy: (len) => `hsl(${(len * 15) % 60 + 320}, 100%, 60%)`,
    player: "#00ffcc"
};

function getShipPath(word) {
    if (word.length >= 5) return SHIP_PATHS.capital;
    return SHIP_PATHS.fighter;
}

function getShipColor(word, isPlayer) {
    if (isPlayer) return SHIP_COLORS.player;
    return SHIP_COLORS.enemy(word.length);
}
