let currentTheme = "";

const lightTheme = {
    "--app-background-color": "rgb(248, 248, 248)",
    "--scrollbar-thumb": "#8000ff",
    "--scrollbar": "rgba(92, 102, 130, 1)",
    "--boxshadow": "0px 0px 10px 0px rgba(172, 172, 172, 0.2)",
    "--boxshadow-hover": "0px 0px 10px 0px rgba(172, 172, 172, 1)",
    "--character-add-color": "dimgrey",
    "--character-add-background-color": "white",
    "--card-color": "darkgrey",
    "--card-title-color": "dimgray",
    "--card-background-color": "white",
    "--boxshadow-inset": "inset 0px 0px 10px -2px rgba(0, 0, 0, 0.1)",
    "--card-seperator-line": "1px dashed lightgray",
    "--button-color": "white",
    "--button-background-color": "#8000ff",
    "--button-boxshadow": "0px 0px 2px 0px rgba(0, 0, 0, 0.75)",
    "--pagination-input-height": "28px",
    "--pagination-input-border": "1px solid lightgray",
    "--pagination-input-boxshadow": "none",
    "--pagination-input-background-color": "white",
    "--pagination-input-color": "inherit",
    "--gradient": "linear-gradient(180deg, rgba(59,37,80,1) 0%, rgba(102,71,159,1) 100%)",
    "--notification-color": "#8000ff",
};
const darkTheme = {
    "--app-background-color": "#1f2532",
    "--scrollbar-thumb": "#8000ff",
    "--scrollbar": "rgba(0, 0, 0, 0.425)",
    "--boxshadow": "0px 0px 10px 0px rgba(0,0,0, 0.2)",
    "--boxshadow-hover": "0px 0px 10px 0px rgba(0, 0, 0, 0.7)",
    "--character-add-color": "lightslategray",
    "--character-add-background-color": "#333d51",
    "--card-color": "lightslategray",
    "--card-title-color": "darkgrey",
    "--card-background-color": "#333d51",
    "--boxshadow-inset": "inset 0px 0px 10px -2px rgba(0, 0, 0, 0.4)",
    "--card-seperator-line": "1px dashed dimgray",
    "--button-color": "#cfc8d8",
    "--button-background-color": "#522a82",
    "--pagination-input-height": "30px",
    "--pagination-input-border": "none",
    "--pagination-input-boxshadow": "0px 0px 10px 0px rgba(0, 0, 0, 0.2)",
    "--pagination-input-background-color": "#475062",
    "--pagination-input-color": "lightgrey",
    "--gradient": "linear-gradient(180deg, rgba(41,26,56,1) 0%, rgba(59,37,80,1) 100%)",
    "--notification-color": "lightslategray",
};


module.exports.applyTheme = nextTheme => {
    const themeClass = nextTheme === "dark" ? lightTheme : darkTheme;
    Object.keys(themeClass).map(key => {
        const value = themeClass[key];
        document.documentElement.style.setProperty(key, value);
    });
};

module.exports.setTheme = theme => {
    currentTheme = theme;
};

module.exports.getTheme = () => {
    return currentTheme;
};