const { data, error } = await supabase
  .from('position')
  .upsert({ ... })
console.log('upsert result:', { data, error })
