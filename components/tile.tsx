import React from "react";

interface TileProps {
	letter: string;
	color?: "green" | "yellow" | "gray" | "";
}

const Tile = ({ letter, color = "" }: TileProps) => {
	return <div className={`tile ${color}`}>{letter}</div>;
};

export default Tile;
