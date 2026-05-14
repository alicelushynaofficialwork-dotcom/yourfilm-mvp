import { baseUserProfile, profileAchievements, userLevels } from '../data/profile.js';

export function getUserProfileProgress(profile = baseUserProfile) {
  const currentLevel =
    userLevels.find((level) => profile.xp >= level.minXp && profile.xp < level.maxXp) ??
    userLevels[userLevels.length - 1];
  const currentLevelIndex = userLevels.findIndex((level) => level.id === currentLevel.id);
  const nextLevel = userLevels[currentLevelIndex + 1] ?? currentLevel;
  const levelRange = Math.max(currentLevel.maxXp - currentLevel.minXp, 1);
  const xpInsideLevel = Math.max(profile.xp - currentLevel.minXp, 0);
  const progressPercent =
    currentLevel.id === nextLevel.id
      ? 100
      : Math.min(Math.round((xpInsideLevel / levelRange) * 100), 100);
  const xpToNextLevel =
    currentLevel.id === nextLevel.id ? 0 : Math.max(nextLevel.minXp - profile.xp, 0);

  return {
    ...profile,
    level: currentLevel,
    nextLevel,
    progressPercent,
    xpToNextLevel,
    achievements: profileAchievements.map((achievement) => ({
      ...achievement,
      unlocked: profile.achievements.includes(achievement.id),
    })),
  };
}
