import {
	ListBulletIcon,
	FolderPlusIcon,
	PlusCircleIcon,
	TagIcon,
} from "@heroicons/react/24/outline";

import { Task } from "./canvas/elements/task";
import { Group } from "./canvas/elements/group";
import { BlockType, selectedBlock } from "./canvas/elements/block";
import { TextBlock } from "./canvas/elements/text";
import { saveCanvas } from "./canvas/primitives/serialize";

function App() {
	const { block } = selectedBlock();
	return (
		<div
			id="content"
			className="w-full h-full p-5 flex flex-col items-start gap-5 select-none"
		>
			<button className="border-[1px] rounded-md border-gray-300 bg-white hover:bg-gray-100 p-2 flex items-center justify-center">
				<ListBulletIcon color="black" className="w-5 h-5" />
			</button>
			<div className="bg-white absolute left-[50%] flex translate-x-[-50%] text-xs text-gray-800 rounded-md shadow-md p-1 space-x-1 border-[1px]">
				<button
					onClick={() => {
						new Task();
						saveCanvas();
					}}
					className="p-2 gap-1 flex flex-col items-center hover:bg-gray-100 rounded-md"
				>
					<PlusCircleIcon className="w-5 h-5 text-gray-800" />
					New Task
				</button>
				<button
					onClick={() => {
						new Group();
						saveCanvas();
					}}
					className="p-2 gap-1  flex flex-col items-center hover:bg-gray-100 rounded-md"
				>
					<FolderPlusIcon className="w-5 h-5 text-gray-800" />
					New Group
				</button>
				<button
					onClick={() => {
						new TextBlock();
						saveCanvas();
					}}
					className="p-2 gap-1  flex flex-col items-center hover:bg-gray-100 rounded-md"
				>
					<TagIcon className="w-5 h-5 text-gray-800" />
					New Text
				</button>
			</div>
			{block && block.type == BlockType.Task && <TaskEditor />}
			{block && block.type == BlockType.Group && <GroupEditor />}
			{block && block.type == BlockType.Text && <TextEditor />}
		</div>
	);
}

function TaskEditor() {
	const { block } = selectedBlock() as { block: Task };
	if (!block) return null;

	return (
		<div className="bg-white rounded-md shadow-md p-2 border-[1px] border-gray-200 text-gray-800 space-y-4">
			<div className="space-y-1">
				<div className="text-xs">Name</div>
				<input
					type="text"
					className="text-sm border-[1px] rounded-md border-gray-300 bg-white outline-none px-2 py-1"
					value={block.name}
					onChange={(event) => {
						block.name = event.target.value;
						selectedBlock.setState({ block });
					}}
				/>
			</div>
			<div className="space-y-1">
				<div className="text-xs">Short Description</div>
				<input
					type="text"
					className="text-sm border-[1px] rounded-md border-gray-300 bg-white outline-none px-2 py-1"
					value={block.description}
					onChange={(event) => {
						block.setDescription(event.target.value);
						selectedBlock.setState({ block });
					}}
				/>
			</div>
			<div className="space-y-1">
				<div className="text-xs">Task Priority</div>
				<div className="flex gap-1">
					<button
						onClick={() => {
							block.priority = "S";
							selectedBlock.setState({ block });
						}}
						disabled={block.priority == "S"}
						className="border-[1px] disabled:bg-gray-100 rounded-md border-gray-300 bg-white hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
					>
						S
					</button>
					<button
						onClick={() => {
							block.priority = "M";
							selectedBlock.setState({ block });
						}}
						disabled={block.priority == "M"}
						className="border-[1px] disabled:bg-gray-100 rounded-md border-gray-300 bg-white hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
					>
						M
					</button>
					<button
						onClick={() => {
							block.priority = "L";
							selectedBlock.setState({ block });
						}}
						disabled={block.priority == "L"}
						className="border-[1px] disabled:bg-gray-100 rounded-md border-gray-300 bg-white hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
					>
						L
					</button>
					<button
						onClick={() => {
							block.priority = "XL";
							selectedBlock.setState({ block });
						}}
						disabled={block.priority == "XL"}
						className="border-[1px] disabled:bg-gray-100 rounded-md border-gray-300 bg-white hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
					>
						XL
					</button>
				</div>
			</div>
			<div className="space-y-1">
				<div className="text-xs">Position</div>

				<button
					onClick={() => {
						block.locked = !block.locked;
						selectedBlock.setState({ block });
					}}
					className="border-[1px] disabled:bg-gray-100 rounded-md border-gray-300 bg-white hover:bg-gray-100 w-full h-8 flex items-center justify-center"
				>
					{block.locked ? "Locked" : "Free Move"}
				</button>
			</div>
			<div className="space-y-1">
				<div className="text-xs">Status</div>
				<div className="flex gap-1 text-sm">
					<button
						onClick={() => {
							block.decoration = "";
							selectedBlock.setState({ block });
						}}
						disabled={block.decoration == ""}
						className="border-[1px] disabled:bg-gray-100 rounded-md border-gray-300 bg-white hover:bg-gray-100 w-full h-8 flex items-center justify-center"
					>
						None
					</button>
					<button
						onClick={() => {
							block.decoration = "checked.png";
							selectedBlock.setState({ block });
						}}
						disabled={block.decoration == "checked.png"}
						className="border-[1px] disabled:bg-gray-100 rounded-md border-gray-300 bg-white hover:bg-gray-100 w-full h-8 flex items-center justify-center"
					>
						Check
					</button>
					<button
						onClick={() => {
							block.decoration = "canceled.png";
							selectedBlock.setState({ block });
						}}
						disabled={block.decoration == "canceled.png"}
						className="border-[1px] disabled:bg-gray-100 rounded-md border-gray-300 bg-white hover:bg-gray-100 w-full h-8 flex items-center justify-center"
					>
						Block
					</button>
				</div>
			</div>
		</div>
	);
}

function TextEditor() {
	const { block } = selectedBlock() as { block: TextBlock };
	if (!block) return null;

	return (
		<div className="bg-white rounded-md shadow-md p-2 border-[1px] border-gray-200 text-gray-800 space-y-4">
			<div className="space-y-1">
				<div className="text-xs">Text</div>
				<textarea
					rows={5}
					className="text-sm border-[1px] rounded-md border-gray-300 bg-white outline-none px-2 py-1"
					value={block.name}
					onChange={(event) => {
						block.name = event.target.value;
						selectedBlock.setState({ block });
					}}
				/>
			</div>

			<div className="space-y-1">
				<div className="text-xs">Text Size</div>
				<div className="flex gap-1">
					<button
						onClick={() => {
							block.textSize = 18;

							selectedBlock.setState({ block });
						}}
						disabled={block.textSize == 18}
						className="border-[1px] disabled:bg-gray-100 rounded-md border-gray-300 bg-white hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
					>
						S
					</button>
					<button
						onClick={() => {
							block.textSize = 24;
							selectedBlock.setState({ block });
						}}
						disabled={block.textSize == 24}
						className="border-[1px] disabled:bg-gray-100 rounded-md border-gray-300 bg-white hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
					>
						M
					</button>
					<button
						onClick={() => {
							block.textSize = 32;
							selectedBlock.setState({ block });
						}}
						disabled={block.textSize == 32}
						className="border-[1px] disabled:bg-gray-100 rounded-md border-gray-300 bg-white hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
					>
						L
					</button>
					<button
						onClick={() => {
							block.textSize = 48;
							selectedBlock.setState({ block });
						}}
						disabled={block.textSize == 48}
						className="border-[1px] disabled:bg-gray-100 rounded-md border-gray-300 bg-white hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
					>
						XL
					</button>
				</div>
			</div>
			<div className="space-y-1">
				<div className="text-xs">Position</div>

				<button
					onClick={() => {
						block.locked = !block.locked;
						selectedBlock.setState({ block });
					}}
					className="border-[1px] disabled:bg-gray-100 rounded-md border-gray-300 bg-white hover:bg-gray-100 w-full h-8 flex items-center justify-center"
				>
					{block.locked ? "Locked" : "Free Move"}
				</button>
			</div>
		</div>
	);
}

function GroupEditor() {
	const { block } = selectedBlock() as { block: Group };
	if (!block) return null;

	return (
		<div className="bg-white rounded-md shadow-md p-2 border-[1px] border-gray-200 text-gray-800 space-y-4">
			<div className="space-y-1">
				<div className="text-xs">Name</div>
				<input
					type="text"
					className="text-sm border-[1px] rounded-md border-gray-300 bg-white outline-none px-2 py-1"
					value={block.name}
					onChange={(event) => {
						block.name = event.target.value;
						selectedBlock.setState({ block });
					}}
				/>
			</div>

			<div className="space-y-1">
				<div className="text-xs">Position</div>

				<button
					onClick={() => {
						block.locked = !block.locked;
						selectedBlock.setState({ block });
					}}
					className="border-[1px] disabled:bg-gray-100 rounded-md border-gray-300 bg-white hover:bg-gray-100 w-full h-8 flex items-center justify-center"
				>
					{block.locked ? "Locked" : "Free Move"}
				</button>
			</div>
			<div className="space-y-1">
				<div className="text-xs">Auto Status</div>
				<div className="flex gap-1 text-xs">
					<button
						onClick={() => {
							block.autoDecoration = null;
							selectedBlock.setState({ block });
						}}
						disabled={block.autoDecoration === null}
						className="border-[1px] disabled:bg-gray-100 rounded-md border-gray-300 bg-white hover:bg-gray-100 w-full h-8 flex items-center justify-center"
					>
						Any
					</button>
					<button
						onClick={() => {
							block.autoDecoration = "";
							selectedBlock.setState({ block });
						}}
						disabled={block.autoDecoration === ""}
						className="border-[1px] disabled:bg-gray-100 rounded-md border-gray-300 bg-white hover:bg-gray-100 w-full h-8 flex items-center justify-center"
					>
						None
					</button>
					<button
						onClick={() => {
							block.autoDecoration = "checked.png";
							selectedBlock.setState({ block });
						}}
						disabled={block.autoDecoration == "checked.png"}
						className="border-[1px] disabled:bg-gray-100 rounded-md border-gray-300 bg-white hover:bg-gray-100 w-full h-8 flex items-center justify-center"
					>
						Check
					</button>
					<button
						onClick={() => {
							block.autoDecoration = "canceled.png";
							selectedBlock.setState({ block });
						}}
						disabled={block.autoDecoration == "canceled.png"}
						className="border-[1px] disabled:bg-gray-100 rounded-md border-gray-300 bg-white hover:bg-gray-100 w-full h-8 flex items-center justify-center"
					>
						Block
					</button>
				</div>
			</div>
		</div>
	);
}

export default App;
