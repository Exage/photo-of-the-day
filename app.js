const client_id = 'ODhArzMCzpILNdMA0cvSINLbWVK6hf9nhE1-ghR-ysA'

let photos = JSON.parse(localStorage.getItem('photos')) || []

const setPhotoToLs = (item) => {
    photos.unshift(item)
    localStorage.setItem('photos', JSON.stringify(photos))
}

const setPhotosToLs = (photos) => {
    localStorage.setItem('photos', JSON.stringify(photos))
}

const fetchPhoto = async () => {
    const response = await fetch(`https://api.unsplash.com/photos/random/?client_id=${client_id}`)
    const json = await response.json()

    const photo = {
        id: json.id,
        url: json.urls.small,
        author: {
            first_name: json.user.first_name,
            last_name: json.user.last_name,
            bio: json.user.bio,
            link: json.user.links.html,
        },
        likes: 0
    }

    return photo
}

const displayPhoto = async (photoFetched) => {
    const photo = document.querySelector('.photo')
    const photoWrapper = document.querySelector('.photo__wrapper')

    photoWrapper.style.backgroundImage = `url(${photoFetched.url})`

    const photoDisplay = photoWrapper.querySelector('img')
    photoDisplay.setAttribute('src', photoFetched.url)

    const authorLink = photo.querySelector('.photographer > .photographer__link')
    const authorBio = photo.querySelector('.photographer > .photographer__bio')

    authorLink.setAttribute('href', photoFetched.author.link)
    authorLink.innerHTML = `${photoFetched.author.first_name} ${photoFetched.author.last_name}`
    authorBio.innerHTML = photoFetched.author.bio || 'No Bio'

    const likeCount = photo.querySelector('.likes > .likes__count')
    const likeBtn = photo.querySelector('.likes > .likes__btn')

    likeCount.innerHTML = photoFetched.likes
    likeBtn.setAttribute('data-btnphotoid', photoFetched.id)

    window.scrollTo({ behavior: 'smooth', top: 0 })
}

const showHistory = () => {
    photos = JSON.parse(localStorage.getItem('photos')) || []

    const photosWrapper = document.querySelector('.photos')

    photos.forEach(photo => {
        const photoItem = document.createElement('div')
        photoItem.classList.add('photos__item')
        photoItem.setAttribute('data-photoid', photo.id)

        const photoDisplay = document.createElement('img')
        photoDisplay.setAttribute('src', photo.url)
        photoDisplay.style.display = 'none'

        const photoInfo = document.createElement('div')
        photoInfo.style.display = 'none'
        photoInfo.classList.add('photos__item-info')
        photoInfo.innerHTML = `
            <div class="photos__item-info__likes">
                <svg class="icon">
                    <use xlink:href="#heart"></use>
                </svg>
                <div class="count">
                    ${photo.likes}
                </div>
            </div>
        `

        const photoLoader = document.createElement('div')
        photoLoader.innerHTML = 'loading...'
        photoLoader.style.display = 'block'

        photoDisplay.addEventListener('load', () => {
            photoLoader.style.display = 'none'
            photoDisplay.style.display = 'block'
            photoInfo.style.display = 'flex'
        })

        photoItem.insertAdjacentElement('beforeend', photoDisplay)
        photoItem.insertAdjacentElement('beforeend', photoInfo)
        photoItem.insertAdjacentElement('beforeend', photoLoader)

        photoItem.addEventListener('click', () => {
            displayPhoto(photo)
        })

        photosWrapper.insertAdjacentElement('beforeend', photoItem)
    })
}

const loadPage = async () => {
    const photoWrapper = document.querySelector('.photo')
    const photoDisplay = photoWrapper.querySelector('.photo img')
    const photoPreloader = document.querySelector('.photo__loader')

    const photo = await fetchPhoto()
    const likeBtn = document.querySelector('.likes__btn')

    photoDisplay.addEventListener('load', () => {
        photoWrapper.style.display = 'block'
        photoPreloader.style.display = 'none'
    })

    likeBtn.addEventListener('click', () => {
        const photoId = likeBtn.getAttribute('data-btnphotoid')
        const counterElem = likeBtn.previousElementSibling
        let counter = +counterElem.innerHTML

        const photoElem = photos.find(photo => photo.id === photoId)

        counter++

        counterElem.innerHTML = counter
        photoElem.likes = counter

        setPhotosToLs(photos)

        const photoHistory = document.querySelector(`[data-photoid="${photoId}"]`)
        const photoHistoryCount = photoHistory.querySelector('.count')
        
        photoHistoryCount.innerHTML = counter
    })

    setPhotoToLs(photo)
    displayPhoto(photo)
    showHistory()
}

window.addEventListener('DOMContentLoaded', loadPage)