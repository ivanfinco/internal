import { supabase } from '../config/supabase';

/**
 * Supabase DB Service with Realtime Sync & LocalStorage Fallback Protection
 */

// --- USER PROFILE ---
export async function fetchUserProfile() {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', 'ivan_profile')
      .single();

    if (error || !data) return null;

    return {
      name: data.name,
      avatar: data.avatar,
      dob: data.dob,
      age: data.age,
      height: data.height,
      weight: data.weight,
      bodyType: data.body_type,
      preset: data.preset,
      targets: data.targets
    };
  } catch (err) {
    console.warn("Supabase fetch profile fallback:", err);
    return null;
  }
}

export async function saveUserProfile(profile) {
  try {
    await supabase.from('user_profiles').upsert({
      id: 'ivan_profile',
      name: profile.name,
      avatar: profile.avatar,
      dob: profile.dob,
      age: profile.age,
      height: profile.height,
      weight: profile.weight,
      body_type: profile.bodyType,
      preset: profile.preset,
      targets: profile.targets,
      updated_at: new Date().toISOString()
    });
  } catch (err) {
    console.warn("Supabase save profile fallback:", err);
  }
}

// --- FOOD LOGS ---
export async function fetchFoodLogs() {
  try {
    const { data, error } = await supabase
      .from('food_logs')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error || !data) return null;

    return data.map(item => ({
      id: item.id,
      timestamp: item.timestamp,
      mealType: item.meal_type,
      description: item.description,
      calories: item.calories,
      protein: item.protein,
      fats: item.fats,
      carbs: item.carbs,
      micros: item.micros,
      ingredientsBreakdown: item.ingredients_breakdown
    }));
  } catch (err) {
    console.warn("Supabase fetch food logs fallback:", err);
    return null;
  }
}

export async function addFoodLog(log) {
  try {
    await supabase.from('food_logs').insert({
      id: log.id,
      timestamp: log.timestamp,
      meal_type: log.mealType,
      description: log.description,
      calories: log.calories,
      protein: log.protein,
      fats: log.fats,
      carbs: log.carbs,
      micros: log.micros,
      ingredients_breakdown: log.ingredientsBreakdown
    });
  } catch (err) {
    console.warn("Supabase add food log fallback:", err);
  }
}

export async function updateFoodLog(log) {
  try {
    await supabase.from('food_logs').upsert({
      id: log.id,
      timestamp: log.timestamp,
      meal_type: log.mealType,
      description: log.description,
      calories: log.calories,
      protein: log.protein,
      fats: log.fats,
      carbs: log.carbs,
      micros: log.micros,
      ingredients_breakdown: log.ingredientsBreakdown
    });
  } catch (err) {
    console.warn("Supabase update food log fallback:", err);
  }
}

export async function deleteFoodLog(id) {
  try {
    await supabase.from('food_logs').delete().eq('id', id);
  } catch (err) {
    console.warn("Supabase delete food log fallback:", err);
  }
}

// --- TRAINING LOGS ---
export async function fetchTrainingLogs() {
  try {
    const { data, error } = await supabase
      .from('training_logs')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error || !data) return null;

    return data.map(item => ({
      id: item.id,
      timestamp: item.timestamp,
      title: item.title,
      feeling: item.feeling,
      energyLevel: item.energy_level,
      exercises: item.exercises,
      notes: item.notes
    }));
  } catch (err) {
    console.warn("Supabase fetch training logs fallback:", err);
    return null;
  }
}

export async function addTrainingLog(log) {
  try {
    await supabase.from('training_logs').insert({
      id: log.id,
      timestamp: log.timestamp,
      title: log.title,
      feeling: log.feeling,
      energy_level: log.energyLevel,
      exercises: log.exercises,
      notes: log.notes
    });
  } catch (err) {
    console.warn("Supabase add training log fallback:", err);
  }
}

export async function deleteTrainingLog(id) {
  try {
    await supabase.from('training_logs').delete().eq('id', id);
  } catch (err) {
    console.warn("Supabase delete training log fallback:", err);
  }
}

// --- TRADING LOGS ---
export async function fetchTradingLogs() {
  try {
    const { data, error } = await supabase
      .from('trading_logs')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error || !data) return null;

    return data.map(item => ({
      id: item.id,
      timestamp: item.timestamp,
      ticker: item.ticker,
      type: item.type,
      entryPrice: item.entry_price,
      takeProfit: item.take_profit,
      stopLoss: item.stop_loss,
      size: item.size,
      status: item.status,
      notes: item.notes,
      pnl: item.pnl
    }));
  } catch (err) {
    console.warn("Supabase fetch trading logs fallback:", err);
    return null;
  }
}

export async function addTradingLog(log) {
  try {
    await supabase.from('trading_logs').insert({
      id: log.id,
      timestamp: log.timestamp,
      ticker: log.ticker,
      type: log.type,
      entry_price: log.entryPrice,
      take_profit: log.takeProfit,
      stop_loss: log.stopLoss,
      size: log.size,
      status: log.status,
      notes: log.notes,
      pnl: log.pnl
    });
  } catch (err) {
    console.warn("Supabase add trading log fallback:", err);
  }
}

export async function updateTradingLog(log) {
  try {
    await supabase.from('trading_logs').upsert({
      id: log.id,
      timestamp: log.timestamp,
      ticker: log.ticker,
      type: log.type,
      entry_price: log.entryPrice,
      take_profit: log.takeProfit,
      stop_loss: log.stopLoss,
      size: log.size,
      status: log.status,
      notes: log.notes,
      pnl: log.pnl
    });
  } catch (err) {
    console.warn("Supabase update trading log fallback:", err);
  }
}

export async function deleteTradingLog(id) {
  try {
    await supabase.from('trading_logs').delete().eq('id', id);
  } catch (err) {
    console.warn("Supabase delete trading log fallback:", err);
  }
}

// --- REAL-TIME SUBSCRIPTION LISTENER ---
export function subscribeToRealtimeChanges(onRefresh) {
  try {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        () => {
          if (onRefresh) onRefresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn("Realtime subscription fallback:", err);
    return () => {};
  }
}
