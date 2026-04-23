export const calculateReadiness = (user) => {
  const cgpaScore = Math.min((user.academics?.cgpa || 0) * 10, 100);
  const academicConsistency = ((user.academics?.tenthPercentage || 0) + (user.academics?.twelfthPercentage || 0)) / 2;
  const strengthsBoost = Math.min((user.strengths?.length || 0) * 6, 24);
  const weaknessPenalty = Math.min((user.weaknesses?.length || 0) * 4, 20);
  const skillBoost = Math.min((user.skills?.length || 0) * 5, 25);

  return Math.max(0, Math.min(100, Math.round((cgpaScore * 0.45) + (academicConsistency * 0.25) + strengthsBoost + skillBoost - weaknessPenalty)));
};
