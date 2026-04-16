import { useState } from "react"
import { z } from "zod"

type FormValues = Record<string, string>

export function useZodForm(schema: z.ZodObject<Record<string, z.ZodTypeAny>>) {
  const [values, setValues] = useState<FormValues>(() => {
    const defaults: Record<string, string> = {}
    Object.keys(schema.shape).forEach((key) => {
      defaults[key] = ""
    })
    return defaults
  })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  const validateField = (field: string, value: string) => {
    const fieldSchema = schema.shape[field]
    const result = fieldSchema.safeParse(value)
    if (result.success) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    } else {
      const message = result.error.issues[0]?.message
      setErrors((prev) => ({ ...prev, [field]: message }))
    }
  }

  const handleChange = (field: string, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      validateField(field, value)
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field, values[field])
  }

  const validate = () => {
    const result = schema.safeParse(values)
    if (!result.success) {
      const nextErrors: Partial<Record<string, string>> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        nextErrors[field] = issue.message
      })
      setErrors(nextErrors)
      setTouched(() => {
        const allTouched: Record<string, boolean> = {}
        Object.keys(schema.shape).forEach((key) => {
          allTouched[key] = true
        })
        return allTouched
      })
      return false
    }
    setErrors({})
    return true
  }

  const reset = () => {
    const defaults: Record<string, string> = {}
    Object.keys(schema.shape).forEach((key) => {
      defaults[key] = ""
    })
    setValues(defaults)
    setTouched({})
    setErrors({})
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setValues,
    setErrors,
  }
}