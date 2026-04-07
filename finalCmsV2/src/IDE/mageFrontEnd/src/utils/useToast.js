import { ElMessage } from 'element-plus'

// 为Composition API提供toast功能
export function useToast() {
  return {
    success(message, duration = 2000) {
      ElMessage({
        message,
        type: 'success',
        duration
      })
    },
    warning(message, duration = 2000) {
      ElMessage({
        message,
        type: 'warning',
        duration
      })
    },
    error(message, duration = 2000) {
      ElMessage({
        message,
        type: 'error',
        duration
      })
    },
    info(message, duration = 2000) {
      ElMessage({
        message,
        type: 'info',
        duration
      })
    }
  }
}
