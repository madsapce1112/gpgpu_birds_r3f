'use server'
import { cookies } from 'next/headers'

export const getCookie = async (name: string) => (cookies().get(name)?.value ?? true) as boolean

export const setCookie = async (name: string, value: string) => cookies().set(name, value)
