import { router } from 'expo-router';

export class TasksCoordinator {
  /**
   * Navigate to tasks list screen
   */
  static navigateToTasksList() {
    router.push('/(tabs)/tasks');
  }

  /**
   * Navigate to create task screen
   */
  static navigateToCreateTask() {
    router.push('/tasks/create');
  }

  /**
   * Navigate to task detail screen
   */
  static navigateToTaskDetail(taskId: string) {
    router.push({
      pathname: '/tasks/[id]',
      params: { id: taskId },
    });
  }

  /**
   * Go back to previous screen
   */
  static goBack() {
    router.back();
  }
}

