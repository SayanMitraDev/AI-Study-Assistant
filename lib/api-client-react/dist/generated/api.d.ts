import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { Card, CardInput, CardUpdate, DashboardStats, Deck, DeckInput, DeckUpdate, DeckWithCards, ErrorResponse, HealthStatus, ListDecksParams, OpenaiConversation, OpenaiConversationInput, OpenaiConversationWithMessages, OpenaiError, OpenaiMessage, OpenaiMessageInput, StudySession, StudySessionInput, Subject, SubjectInput } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListSubjectsUrl: () => string;
/**
 * @summary List all subjects
 */
export declare const listSubjects: (options?: RequestInit) => Promise<Subject[]>;
export declare const getListSubjectsQueryKey: () => readonly ["/api/subjects"];
export declare const getListSubjectsQueryOptions: <TData = Awaited<ReturnType<typeof listSubjects>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSubjects>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listSubjects>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListSubjectsQueryResult = NonNullable<Awaited<ReturnType<typeof listSubjects>>>;
export type ListSubjectsQueryError = ErrorType<unknown>;
/**
 * @summary List all subjects
 */
export declare function useListSubjects<TData = Awaited<ReturnType<typeof listSubjects>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSubjects>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateSubjectUrl: () => string;
/**
 * @summary Create a subject
 */
export declare const createSubject: (subjectInput: SubjectInput, options?: RequestInit) => Promise<Subject>;
export declare const getCreateSubjectMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSubject>>, TError, {
        data: BodyType<SubjectInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createSubject>>, TError, {
    data: BodyType<SubjectInput>;
}, TContext>;
export type CreateSubjectMutationResult = NonNullable<Awaited<ReturnType<typeof createSubject>>>;
export type CreateSubjectMutationBody = BodyType<SubjectInput>;
export type CreateSubjectMutationError = ErrorType<unknown>;
/**
* @summary Create a subject
*/
export declare const useCreateSubject: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSubject>>, TError, {
        data: BodyType<SubjectInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createSubject>>, TError, {
    data: BodyType<SubjectInput>;
}, TContext>;
export declare const getDeleteSubjectUrl: (id: number) => string;
/**
 * @summary Delete a subject
 */
export declare const deleteSubject: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteSubjectMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSubject>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteSubject>>, TError, {
    id: number;
}, TContext>;
export type DeleteSubjectMutationResult = NonNullable<Awaited<ReturnType<typeof deleteSubject>>>;
export type DeleteSubjectMutationError = ErrorType<ErrorResponse>;
/**
* @summary Delete a subject
*/
export declare const useDeleteSubject: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSubject>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteSubject>>, TError, {
    id: number;
}, TContext>;
export declare const getListDecksUrl: (params?: ListDecksParams) => string;
/**
 * @summary List all decks
 */
export declare const listDecks: (params?: ListDecksParams, options?: RequestInit) => Promise<Deck[]>;
export declare const getListDecksQueryKey: (params?: ListDecksParams) => readonly ["/api/decks", ...ListDecksParams[]];
export declare const getListDecksQueryOptions: <TData = Awaited<ReturnType<typeof listDecks>>, TError = ErrorType<unknown>>(params?: ListDecksParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listDecks>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listDecks>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListDecksQueryResult = NonNullable<Awaited<ReturnType<typeof listDecks>>>;
export type ListDecksQueryError = ErrorType<unknown>;
/**
 * @summary List all decks
 */
export declare function useListDecks<TData = Awaited<ReturnType<typeof listDecks>>, TError = ErrorType<unknown>>(params?: ListDecksParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listDecks>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateDeckUrl: () => string;
/**
 * @summary Create a deck
 */
export declare const createDeck: (deckInput: DeckInput, options?: RequestInit) => Promise<Deck>;
export declare const getCreateDeckMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createDeck>>, TError, {
        data: BodyType<DeckInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createDeck>>, TError, {
    data: BodyType<DeckInput>;
}, TContext>;
export type CreateDeckMutationResult = NonNullable<Awaited<ReturnType<typeof createDeck>>>;
export type CreateDeckMutationBody = BodyType<DeckInput>;
export type CreateDeckMutationError = ErrorType<unknown>;
/**
* @summary Create a deck
*/
export declare const useCreateDeck: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createDeck>>, TError, {
        data: BodyType<DeckInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createDeck>>, TError, {
    data: BodyType<DeckInput>;
}, TContext>;
export declare const getGetDeckUrl: (id: number) => string;
/**
 * @summary Get a deck with its cards
 */
export declare const getDeck: (id: number, options?: RequestInit) => Promise<DeckWithCards>;
export declare const getGetDeckQueryKey: (id: number) => readonly [`/api/decks/${number}`];
export declare const getGetDeckQueryOptions: <TData = Awaited<ReturnType<typeof getDeck>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDeck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDeck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDeckQueryResult = NonNullable<Awaited<ReturnType<typeof getDeck>>>;
export type GetDeckQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get a deck with its cards
 */
export declare function useGetDeck<TData = Awaited<ReturnType<typeof getDeck>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDeck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateDeckUrl: (id: number) => string;
/**
 * @summary Update a deck
 */
export declare const updateDeck: (id: number, deckUpdate: DeckUpdate, options?: RequestInit) => Promise<Deck>;
export declare const getUpdateDeckMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateDeck>>, TError, {
        id: number;
        data: BodyType<DeckUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateDeck>>, TError, {
    id: number;
    data: BodyType<DeckUpdate>;
}, TContext>;
export type UpdateDeckMutationResult = NonNullable<Awaited<ReturnType<typeof updateDeck>>>;
export type UpdateDeckMutationBody = BodyType<DeckUpdate>;
export type UpdateDeckMutationError = ErrorType<ErrorResponse>;
/**
* @summary Update a deck
*/
export declare const useUpdateDeck: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateDeck>>, TError, {
        id: number;
        data: BodyType<DeckUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateDeck>>, TError, {
    id: number;
    data: BodyType<DeckUpdate>;
}, TContext>;
export declare const getDeleteDeckUrl: (id: number) => string;
/**
 * @summary Delete a deck
 */
export declare const deleteDeck: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteDeckMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteDeck>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteDeck>>, TError, {
    id: number;
}, TContext>;
export type DeleteDeckMutationResult = NonNullable<Awaited<ReturnType<typeof deleteDeck>>>;
export type DeleteDeckMutationError = ErrorType<ErrorResponse>;
/**
* @summary Delete a deck
*/
export declare const useDeleteDeck: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteDeck>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteDeck>>, TError, {
    id: number;
}, TContext>;
export declare const getListCardsUrl: (deckId: number) => string;
/**
 * @summary List cards in a deck
 */
export declare const listCards: (deckId: number, options?: RequestInit) => Promise<Card[]>;
export declare const getListCardsQueryKey: (deckId: number) => readonly [`/api/decks/${number}/cards`];
export declare const getListCardsQueryOptions: <TData = Awaited<ReturnType<typeof listCards>>, TError = ErrorType<unknown>>(deckId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCards>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCards>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCardsQueryResult = NonNullable<Awaited<ReturnType<typeof listCards>>>;
export type ListCardsQueryError = ErrorType<unknown>;
/**
 * @summary List cards in a deck
 */
export declare function useListCards<TData = Awaited<ReturnType<typeof listCards>>, TError = ErrorType<unknown>>(deckId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCards>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateCardUrl: (deckId: number) => string;
/**
 * @summary Create a card in a deck
 */
export declare const createCard: (deckId: number, cardInput: CardInput, options?: RequestInit) => Promise<Card>;
export declare const getCreateCardMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCard>>, TError, {
        deckId: number;
        data: BodyType<CardInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createCard>>, TError, {
    deckId: number;
    data: BodyType<CardInput>;
}, TContext>;
export type CreateCardMutationResult = NonNullable<Awaited<ReturnType<typeof createCard>>>;
export type CreateCardMutationBody = BodyType<CardInput>;
export type CreateCardMutationError = ErrorType<unknown>;
/**
* @summary Create a card in a deck
*/
export declare const useCreateCard: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCard>>, TError, {
        deckId: number;
        data: BodyType<CardInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createCard>>, TError, {
    deckId: number;
    data: BodyType<CardInput>;
}, TContext>;
export declare const getUpdateCardUrl: (id: number) => string;
/**
 * @summary Update a card (including marking mastered)
 */
export declare const updateCard: (id: number, cardUpdate: CardUpdate, options?: RequestInit) => Promise<Card>;
export declare const getUpdateCardMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCard>>, TError, {
        id: number;
        data: BodyType<CardUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCard>>, TError, {
    id: number;
    data: BodyType<CardUpdate>;
}, TContext>;
export type UpdateCardMutationResult = NonNullable<Awaited<ReturnType<typeof updateCard>>>;
export type UpdateCardMutationBody = BodyType<CardUpdate>;
export type UpdateCardMutationError = ErrorType<ErrorResponse>;
/**
* @summary Update a card (including marking mastered)
*/
export declare const useUpdateCard: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCard>>, TError, {
        id: number;
        data: BodyType<CardUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateCard>>, TError, {
    id: number;
    data: BodyType<CardUpdate>;
}, TContext>;
export declare const getDeleteCardUrl: (id: number) => string;
/**
 * @summary Delete a card
 */
export declare const deleteCard: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteCardMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCard>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteCard>>, TError, {
    id: number;
}, TContext>;
export type DeleteCardMutationResult = NonNullable<Awaited<ReturnType<typeof deleteCard>>>;
export type DeleteCardMutationError = ErrorType<ErrorResponse>;
/**
* @summary Delete a card
*/
export declare const useDeleteCard: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCard>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteCard>>, TError, {
    id: number;
}, TContext>;
export declare const getListStudySessionsUrl: () => string;
/**
 * @summary List recent study sessions
 */
export declare const listStudySessions: (options?: RequestInit) => Promise<StudySession[]>;
export declare const getListStudySessionsQueryKey: () => readonly ["/api/study-sessions"];
export declare const getListStudySessionsQueryOptions: <TData = Awaited<ReturnType<typeof listStudySessions>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listStudySessions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listStudySessions>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListStudySessionsQueryResult = NonNullable<Awaited<ReturnType<typeof listStudySessions>>>;
export type ListStudySessionsQueryError = ErrorType<unknown>;
/**
 * @summary List recent study sessions
 */
export declare function useListStudySessions<TData = Awaited<ReturnType<typeof listStudySessions>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listStudySessions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateStudySessionUrl: () => string;
/**
 * @summary Record a completed study session
 */
export declare const createStudySession: (studySessionInput: StudySessionInput, options?: RequestInit) => Promise<StudySession>;
export declare const getCreateStudySessionMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createStudySession>>, TError, {
        data: BodyType<StudySessionInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createStudySession>>, TError, {
    data: BodyType<StudySessionInput>;
}, TContext>;
export type CreateStudySessionMutationResult = NonNullable<Awaited<ReturnType<typeof createStudySession>>>;
export type CreateStudySessionMutationBody = BodyType<StudySessionInput>;
export type CreateStudySessionMutationError = ErrorType<unknown>;
/**
* @summary Record a completed study session
*/
export declare const useCreateStudySession: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createStudySession>>, TError, {
        data: BodyType<StudySessionInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createStudySession>>, TError, {
    data: BodyType<StudySessionInput>;
}, TContext>;
export declare const getGetDashboardStatsUrl: () => string;
/**
 * @summary Get dashboard summary statistics
 */
export declare const getDashboardStats: (options?: RequestInit) => Promise<DashboardStats>;
export declare const getGetDashboardStatsQueryKey: () => readonly ["/api/dashboard/stats"];
export declare const getGetDashboardStatsQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardStats>>>;
export type GetDashboardStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get dashboard summary statistics
 */
export declare function useGetDashboardStats<TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListOpenaiConversationsUrl: () => string;
/**
 * @summary List all AI tutor conversations
 */
export declare const listOpenaiConversations: (options?: RequestInit) => Promise<OpenaiConversation[]>;
export declare const getListOpenaiConversationsQueryKey: () => readonly ["/api/openai/conversations"];
export declare const getListOpenaiConversationsQueryOptions: <TData = Awaited<ReturnType<typeof listOpenaiConversations>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listOpenaiConversations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listOpenaiConversations>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListOpenaiConversationsQueryResult = NonNullable<Awaited<ReturnType<typeof listOpenaiConversations>>>;
export type ListOpenaiConversationsQueryError = ErrorType<unknown>;
/**
 * @summary List all AI tutor conversations
 */
export declare function useListOpenaiConversations<TData = Awaited<ReturnType<typeof listOpenaiConversations>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listOpenaiConversations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateOpenaiConversationUrl: () => string;
/**
 * @summary Create a new AI tutor conversation
 */
export declare const createOpenaiConversation: (openaiConversationInput: OpenaiConversationInput, options?: RequestInit) => Promise<OpenaiConversation>;
export declare const getCreateOpenaiConversationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOpenaiConversation>>, TError, {
        data: BodyType<OpenaiConversationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createOpenaiConversation>>, TError, {
    data: BodyType<OpenaiConversationInput>;
}, TContext>;
export type CreateOpenaiConversationMutationResult = NonNullable<Awaited<ReturnType<typeof createOpenaiConversation>>>;
export type CreateOpenaiConversationMutationBody = BodyType<OpenaiConversationInput>;
export type CreateOpenaiConversationMutationError = ErrorType<unknown>;
/**
* @summary Create a new AI tutor conversation
*/
export declare const useCreateOpenaiConversation: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOpenaiConversation>>, TError, {
        data: BodyType<OpenaiConversationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createOpenaiConversation>>, TError, {
    data: BodyType<OpenaiConversationInput>;
}, TContext>;
export declare const getGetOpenaiConversationUrl: (id: number) => string;
/**
 * @summary Get conversation with messages
 */
export declare const getOpenaiConversation: (id: number, options?: RequestInit) => Promise<OpenaiConversationWithMessages>;
export declare const getGetOpenaiConversationQueryKey: (id: number) => readonly [`/api/openai/conversations/${number}`];
export declare const getGetOpenaiConversationQueryOptions: <TData = Awaited<ReturnType<typeof getOpenaiConversation>>, TError = ErrorType<OpenaiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOpenaiConversation>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getOpenaiConversation>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetOpenaiConversationQueryResult = NonNullable<Awaited<ReturnType<typeof getOpenaiConversation>>>;
export type GetOpenaiConversationQueryError = ErrorType<OpenaiError>;
/**
 * @summary Get conversation with messages
 */
export declare function useGetOpenaiConversation<TData = Awaited<ReturnType<typeof getOpenaiConversation>>, TError = ErrorType<OpenaiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOpenaiConversation>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getDeleteOpenaiConversationUrl: (id: number) => string;
/**
 * @summary Delete a conversation
 */
export declare const deleteOpenaiConversation: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteOpenaiConversationMutationOptions: <TError = ErrorType<OpenaiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteOpenaiConversation>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteOpenaiConversation>>, TError, {
    id: number;
}, TContext>;
export type DeleteOpenaiConversationMutationResult = NonNullable<Awaited<ReturnType<typeof deleteOpenaiConversation>>>;
export type DeleteOpenaiConversationMutationError = ErrorType<OpenaiError>;
/**
* @summary Delete a conversation
*/
export declare const useDeleteOpenaiConversation: <TError = ErrorType<OpenaiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteOpenaiConversation>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteOpenaiConversation>>, TError, {
    id: number;
}, TContext>;
export declare const getListOpenaiMessagesUrl: (id: number) => string;
/**
 * @summary List messages in a conversation
 */
export declare const listOpenaiMessages: (id: number, options?: RequestInit) => Promise<OpenaiMessage[]>;
export declare const getListOpenaiMessagesQueryKey: (id: number) => readonly [`/api/openai/conversations/${number}/messages`];
export declare const getListOpenaiMessagesQueryOptions: <TData = Awaited<ReturnType<typeof listOpenaiMessages>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listOpenaiMessages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listOpenaiMessages>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListOpenaiMessagesQueryResult = NonNullable<Awaited<ReturnType<typeof listOpenaiMessages>>>;
export type ListOpenaiMessagesQueryError = ErrorType<unknown>;
/**
 * @summary List messages in a conversation
 */
export declare function useListOpenaiMessages<TData = Awaited<ReturnType<typeof listOpenaiMessages>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listOpenaiMessages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getSendOpenaiMessageUrl: (id: number) => string;
/**
 * @summary Send a message and receive a streaming AI response
 */
export declare const sendOpenaiMessage: (id: number, openaiMessageInput: OpenaiMessageInput, options?: RequestInit) => Promise<unknown>;
export declare const getSendOpenaiMessageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendOpenaiMessage>>, TError, {
        id: number;
        data: BodyType<OpenaiMessageInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendOpenaiMessage>>, TError, {
    id: number;
    data: BodyType<OpenaiMessageInput>;
}, TContext>;
export type SendOpenaiMessageMutationResult = NonNullable<Awaited<ReturnType<typeof sendOpenaiMessage>>>;
export type SendOpenaiMessageMutationBody = BodyType<OpenaiMessageInput>;
export type SendOpenaiMessageMutationError = ErrorType<unknown>;
/**
* @summary Send a message and receive a streaming AI response
*/
export declare const useSendOpenaiMessage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendOpenaiMessage>>, TError, {
        id: number;
        data: BodyType<OpenaiMessageInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof sendOpenaiMessage>>, TError, {
    id: number;
    data: BodyType<OpenaiMessageInput>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map