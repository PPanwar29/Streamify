import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getUserFriends } from "../lib/api";
import {
	SearchIcon,
	UsersIcon,
	MessageCircleIcon,
	UserPlusIcon,
	FilterIcon,
} from "lucide-react";
import { Link } from "react-router";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const FriendsPage = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterBy, setFilterBy] = useState("all"); // all, native, learning

	const { data: friends = [], isLoading } = useQuery({
		queryKey: ["friends"],
		queryFn: getUserFriends,
	});

	// Filter friends based on search term and filter
	const filteredFriends = friends.filter((friend) => {
		const matchesSearch =
			friend.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
			friend.nativeLanguage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			friend.learningLanguage?.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesFilter =
			filterBy === "all" ||
			(filterBy === "native" && friend.nativeLanguage) ||
			(filterBy === "learning" && friend.learningLanguage);

		return matchesSearch && matchesFilter;
	});

	const nativeLanguageFriends = friends.filter((f) => f.nativeLanguage);
	const learningLanguageFriends = friends.filter((f) => f.learningLanguage);

	return (
		<div className="p-4 sm:p-6 lg:p-8">
			<div className="container mx-auto space-y-6">
				{/* Header */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
							<UsersIcon className="text-primary" />
							My Friends
						</h1>
						<p className="text-base-content opacity-70 mt-2">
							Connect with your language learning partners
						</p>
					</div>
					<Link to="/" className="btn btn-primary">
						<UserPlusIcon className="size-4 mr-2" />
						Find New Friends
					</Link>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div className="card bg-base-200 hover:bg-base-100 transition-all duration-200 hover:scale-105">
						<div className="card-body p-4">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
									<UsersIcon className="w-5 h-5 text-primary" />
								</div>
								<div>
									<p className="text-2xl font-bold">{friends.length}</p>
									<p className="text-xs opacity-70">Total Friends</p>
								</div>
							</div>
						</div>
					</div>

					<div className="card bg-base-200 hover:bg-base-100 transition-all duration-200 hover:scale-105">
						<div className="card-body p-4">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
									<MessageCircleIcon className="w-5 h-5 text-secondary" />
								</div>
								<div>
									<p className="text-2xl font-bold">
										{nativeLanguageFriends.length}
									</p>
									<p className="text-xs opacity-70">Native Speakers</p>
								</div>
							</div>
						</div>
					</div>

					<div className="card bg-base-200 hover:bg-base-100 transition-all duration-200 hover:scale-105">
						<div className="card-body p-4">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
									<UserPlusIcon className="w-5 h-5 text-accent" />
								</div>
								<div>
									<p className="text-2xl font-bold">
										{learningLanguageFriends.length}
									</p>
									<p className="text-xs opacity-70">Learning Partners</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Search and Filter */}
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="flex-1 relative">
						<SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-50 size-4" />
						<input
							type="text"
							placeholder="Search friends by name or language..."
							className="input input-bordered w-full pl-10"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<div className="flex gap-2">
						<select
							className="select select-bordered"
							value={filterBy}
							onChange={(e) => setFilterBy(e.target.value)}
						>
							<option value="all">All Friends</option>
							<option value="native">Native Speakers</option>
							<option value="learning">Learning Partners</option>
						</select>
					</div>
				</div>

				{/* Friends List */}
				{isLoading ? (
					<div className="flex justify-center py-12">
						<span className="loading loading-spinner loading-lg" />
					</div>
				) : filteredFriends.length === 0 ? (
					<div className="text-center py-12">
						{searchTerm || filterBy !== "all" ? (
							<div className="card bg-base-200 p-8">
								<SearchIcon className="w-12 h-12 text-base-content opacity-30 mx-auto mb-4" />
								<h3 className="font-semibold text-lg mb-2">No friends found</h3>
								<p className="text-base-content opacity-70 mb-4">
									Try adjusting your search or filter criteria
								</p>
								<button
									onClick={() => {
										setSearchTerm("");
										setFilterBy("all");
									}}
									className="btn btn-outline"
								>
									Clear Filters
								</button>
							</div>
						) : (
							<NoFriendsFound />
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{filteredFriends.map((friend) => (
							<FriendCard key={friend._id} friend={friend} />
						))}
					</div>
				)}

				{/* Quick Actions */}
				{filteredFriends.length > 0 && (
					<div className="card bg-base-200 p-6">
						<h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
						<div className="flex flex-wrap gap-3">
							<Link to="/" className="btn btn-outline btn-sm">
								<UserPlusIcon className="size-4 mr-2" />
								Find More Friends
							</Link>
							<Link to="/notifications" className="btn btn-outline btn-sm">
								<MessageCircleIcon className="size-4 mr-2" />
								Friend Requests
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default FriendsPage;
