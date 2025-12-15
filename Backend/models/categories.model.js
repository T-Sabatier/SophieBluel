export default (sequelize, DataTypes) => {
	const Categories = sequelize.define(
		"categories",
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
		},
		{ timestamps: false }
	);
	return Categories;
};