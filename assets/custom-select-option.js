// Custom dropdown - select option
function customDropJs() {
    document.querySelectorAll('[js-custom-option-select]').forEach(function(selectElement) {
        var numberOfOptions = selectElement.children.length;
        var optionName = selectElement.dataset.optionName
        if(optionName) {
            optionName = optionName + ' : '
        } else {
            optionName = ''
        }
        selectElement.classList.add('select-hidden');
    
        var wrapper = document.createElement('div');
        wrapper.className = 'select';
        selectElement.parentNode.insertBefore(wrapper, selectElement);
        wrapper.appendChild(selectElement);
    
        var styledSelect = document.createElement('div');
        styledSelect.className = 'select-styled';
        styledSelect.textContent = optionName + selectElement.children[0].textContent;
        wrapper.appendChild(styledSelect);
    
        var list = document.createElement('ul');
        list.className = 'select-options';
        wrapper.appendChild(list);
    
        for (var i = 0; i < numberOfOptions; i++) {
            var listItem = document.createElement('li');
            listItem.textContent = selectElement.children[i].textContent;
            listItem.setAttribute('rel', selectElement.children[i].value);
            list.appendChild(listItem);
    
            if (selectElement.children[i].selected) {
                listItem.classList.add('is-selected');
            }
        }
    
        var listItems = list.children;
    
        styledSelect.addEventListener('click', function(e) {
            e.stopPropagation();
            document.querySelectorAll('div.select-styled.active').forEach(function(activeStyledSelect) {
                if (activeStyledSelect !== styledSelect) {
                    activeStyledSelect.classList.remove('active');
                    activeStyledSelect.nextElementSibling.style.display = 'none';
                }
            });
            styledSelect.classList.toggle('active');
            list.style.display = styledSelect.classList.contains('active') ? 'block' : 'none';

        });
    
        styledSelect.insertAdjacentHTML('beforeend', `<div class="select-styled-icon"><svg width="14" height="6" viewBox="0 0 14 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 0.984374L7 4.98438L13 0.984375" stroke="#2B2B2B" stroke-linecap="round" stroke-linejoin="round"/>
    </svg></div>`);
    
        Array.from(listItems).forEach(function(listItem) {
            listItem.addEventListener('click', function(e) {
                e.stopPropagation();
                let optionName = styledSelect.closest('.select').querySelector('select').dataset.optionName
                if(optionName) {
                    optionName = optionName + ' : '
                } else {
                    optionName=''
                }
                styledSelect.textContent =optionName +  listItem.textContent;
                
                styledSelect.classList.remove('active');
                selectElement.value = listItem.getAttribute('rel');
                list.querySelector('li.is-selected').classList.remove('is-selected');
                listItem.classList.add('is-selected');
                list.style.display = 'none';

                styledSelect.insertAdjacentHTML('beforeend', `<div class="select-styled-icon"><svg width="14" height="6" viewBox="0 0 14 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 0.984374L7 4.98438L13 0.984375" stroke="#2B2B2B" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>`);
                document.dispatchEvent(new CustomEvent('swapOptionPositions:variant'))
                
                selectElement.dispatchEvent(new Event('change'))
            });
        });
    
        document.addEventListener('click', function() {
            styledSelect.classList.remove('active');
            list.style.display = 'none';
        });
    });
}
customDropJs()
document.addEventListener('custom-drop-style:init', customDropJs)

