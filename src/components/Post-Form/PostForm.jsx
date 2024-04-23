import React,{useCallback, useEffect} from 'react'
import { useForm } from 'react-hook-form'
import appwritService from '../../appwrite/config.js'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Input,Button,Select, RTE } from '../index.js'


function PostForm({post}) {
    const {register, handleSubmit, watch, setValue, getValues, control} = useForm({
        defaultValues : {
            title : post?.title || '',
            slug : post?.$id || '',
            content : post?.content || '',
            status : post?.status || 'active'
        }
    })

    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData)
    

    const submit = async(data) => {
        if(post){
            const file = await appwritService.uploadFile(data.image[0])

            if(file){
                await appwritService.deleteFile(post.featuredImage)
            }

            const upload = await appwritService.updatePost(post.$id,{
                ...data,
                featuredImage : file? file.$id : null
            })

            if(upload){
                navigate(`/post/${upload.$id}`)
            }
        }
        else{
            const file = await appwritService.uploadFile(data.image[0])
            if(file){
                data.featuredImage = file.$id
            }
            const upload = await appwritService.createPost({...data, userId : userData.$id})
            if(upload){
                navigate(`/post/${upload.$id}`);
            }

        }
    }

    const slugTransform = useCallback((value) => {
        if(value && typeof value === 'string'){
            return value
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z\d\s]+/g, "-")
            .replace(/\s/g, "-");
        }
        return ''
    }, [])

    useEffect(() => {
        const subscription = watch((value,{name}) => {
            if(name === 'title'){
                setValue('slug',slugTransform(value.title),{shouldValidate : true})
            }
        })

        return () => subscription.unsubscribe()
    }, [watch, setValue, slugTransform])



  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">

        <div  className="w-2/3 px-2">

            <Input
            label = 'Title :'
            placeholder = 'Title'
            {...register('title',{required : true})}
            className="mb-4"
            />

            <Input
            label = 'Slug :'
            placeholder = 'Slug'
            {...register('slug',{required : true})}
            onInput = {(e) => {
                setValue('slug',slugTransform(e.currentTarget.value),{shouldValidate : true})
            }}
            className="mb-4"
            />    

            <RTE
            label = 'Content :'
            name = 'content'
            defaultValue = {getValues('content')}
            control = {control}
            />

        </div>

        <div className="w-1/3 px-2">

            <Input
            label = 'featuredImage'
            type = 'file'
            placeholder = 'paste your file here..'
            {...register('image',{required : !post})}
            />

            {
                post && 
                <div className="w-full mb-4">

                    <img 
                    src = {appwritService.getFilePreview(post.featuredImage)} 
                    alt = {post.title} 
                    className="rounded-lg"
                    />

                </div>
            }

            <Select
            options = {['active','inactive']}
            label = 'Status'
            {...register('status',{required : true})}
            className="mb-4"
            />

            <Button
            type = 'submit'
            bgColor={post ? "bg-green-500" : undefined} 
            className="w-full"
            children = {post? 'Edit' : 'Submit'}
            />

        </div>

    </form>
  )
}

export default PostForm