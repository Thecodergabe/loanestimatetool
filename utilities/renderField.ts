// ~/utilities/renderField.ts or getFieldRenderConfig.ts
export function getFieldRenderConfig(field: any) {
  const component =
    field.type === 'select' ? 'v-select' :
    field.type === 'checkbox' ? 'v-checkbox' :
    'v-text-field'

  return {
    component,
    props: {
      label: field.label,
      prefix: field.prefix,
      suffix: field.suffix,
      rules: field.rules,
      items: field.options,
      maxlength: field.maxlength,
      type: ['currency', 'percent', 'number'].includes(field.type) ? 'number' : 'text',
      class: 'flex-grow-1'
    }
  }
}