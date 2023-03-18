import React from "react";

interface EmptyListMessage {
	h1: string,
	p: string
}

const EmptyListMessage: React.FC<EmptyListMessage> = ({ h1, p }) => {
	return (
		<div className="h-full bg-no-repeat bg-contain" style={{ backgroundImage: 'url("/img/empty-box.png")', backgroundPosition: 'center' }}>
			<h2 className="text-3xl text-gray-800 dark:text-gray-300">{ h1 }</h2>
			<p className="mt-4 text-2xl text-gray-500 dark:text-gray-500">{ p }</p>
		</div>
	)
}

export default EmptyListMessage;