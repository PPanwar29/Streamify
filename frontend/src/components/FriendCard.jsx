import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFriend } from "../lib/api";

const FriendCard = ({ friend }) => {
	const queryClient = useQueryClient();
	const { mutate: removeFriendMutation, isPending } = useMutation({
		mutationFn: removeFriend,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["friends"] });
			queryClient.invalidateQueries({ queryKey: ["users"] }); // Invalidate users to update recommendations
		},
	});

	return (
		<div className="card bg-base-200 hover:shadow-md transition-shadow">
			<div className="card-body p-4">
				{/* USER INFO */}
				<div className="flex items-center gap-3 mb-3">
					<div className="avatar size-12">
						<img src={friend.profilePic} alt={friend.fullname} />
					</div>
					<h3 className="font-semibold truncate">{friend.fullname}</h3>
				</div>

				<div className="flex flex-wrap gap-1.5 mb-3">
					<span className="badge badge-secondary text-xs">
						{getLanguageFlag(friend.nativeLanguage)}
						Native: {friend.nativeLanguage}
					</span>
					<span className="badge badge-outline text-xs">
						{getLanguageFlag(friend.learningLanguage)}
						Learning: {friend.learningLanguage}
					</span>
				</div>

				<Link
					to={`/chat/${friend._id}`}
					className="btn btn-outline w-full mb-2"
				>
					Message
				</Link>
				<button
					className="btn btn-error btn-sm w-full"
					onClick={() => removeFriendMutation(friend._id)}
					disabled={isPending}
				>
					{isPending ? "Removing..." : "Remove Friend"}
				</button>
			</div>
		</div>
	);
};
export default FriendCard;

export function getLanguageFlag(language) {
	if (!language) return null;

	const langLower = language.toLowerCase();
	const countryCode = LANGUAGE_TO_FLAG[langLower];

	if (countryCode) {
		return (
			<img
				src={`https://flagcdn.com/24x18/${countryCode}.png`}
				alt={`${langLower} flag`}
				className="h-3 mr-1 inline-block"
			/>
		);
	}
	return null;
}
