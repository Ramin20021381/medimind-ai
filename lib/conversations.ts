import { createClient } from "./supabase";

export type ConversationMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export type Conversation = {
  id: string;
  title: string;
  updated_at: string;
  messages: ConversationMessage[];
};

async function getAuthenticatedClient() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("You must be logged in.");
  }

  return { supabase, user };
}

export async function loadConversations() {
  const { supabase } = await getAuthenticatedClient();

  const { data, error } = await supabase
    .from("conversations")
    .select(`
      id,
      title,
      updated_at,
      messages (
        id,
        role,
        content,
        created_at
      )
    `)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as Conversation[];
}

export async function createConversation(title: string) {
  const { supabase, user } = await getAuthenticatedClient();

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      title,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function saveMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string
) {
  const { supabase } = await getAuthenticatedClient();

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      role,
      content,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateConversation(conversationId: string) {
  const { supabase } = await getAuthenticatedClient();

  const { error } = await supabase
    .from("conversations")
    .update({
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId);

  if (error) throw error;
}

export async function deleteConversation(conversationId: string) {
  const { supabase } = await getAuthenticatedClient();

  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId);

  if (error) throw error;
}