
import { useState, useEffect } from 'react';
import { User, UserAction } from '@/types';
import { getAllUsersService, getUserByIdService, getUserActionsService } from './authService';

/**
 * Hook to get all users with sync API
 */
export const useGetAllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    getAllUsersService().then(setUsers);
  }, []);
  
  return users;
};

/**
 * Hook to get user by ID with sync API
 */
export const useGetUserById = (id: string) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  
  useEffect(() => {
    getUserByIdService(id).then(setUser);
  }, [id]);
  
  return user;
};

/**
 * Hook to get user actions with sync API
 */
export const useGetUserActions = (userId: string) => {
  const [actions, setActions] = useState<UserAction[]>([]);
  
  useEffect(() => {
    getUserActionsService(userId).then(setActions);
  }, [userId]);
  
  return actions;
};
