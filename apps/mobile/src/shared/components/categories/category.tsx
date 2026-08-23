export type CategoryType = "expense" | "income";

export type Category = {
	id: string;
	name: string;
	type: CategoryType;
};

export type CreateCategoryInput = {
	name: string;
	type: CategoryType;
};
